'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';

import { useClient } from '../client/ClientContext';
import { useGlobalAlert } from '../alert';
import { useI18n } from '@havenova/contexts/i18n';
import { getI18nFallbacks } from '../i18n';
import { AuthRole, AuthUser } from '@/packages/types';
import { useRouter } from 'next/navigation';
import { getPopup, normalizeAuthSession, type AuthSessionSeed } from '@havenova/utils';
import {
  clearCsrfToken,
  getAuthUser,
  getCsrfDebugState,
  getCsrfToken,
  logoutUser,
  reissueCsrfToken,
  refreshToken,
} from '@havenova/services';

const AUTH_STORAGE_KEY = 'hv-auth';
const AUTH_RECENT_LOGIN_KEY = 'hv-auth-recent-login-at';
const WORKER_STORAGE_KEY = 'hv-worker-profile';
const AUTH_REQUEST_TIMEOUT_MS = 8000;
const AUTH_RECENT_LOGIN_GRACE_MS = 5000;
const AUTH_UNAUTHENTICATED_BOOTSTRAP_COOLDOWN_MS = 3000;
const AUTH_SERVER_SYNC_COOLDOWN_MS = 1500;
type AuthSource = 'server' | 'storage' | 'default' | 'dev-fallback';

type AuthRefreshResult = {
  auth: AuthUser;
  source: AuthSource;
  isOffline: boolean;
  lastSyncAt: string | null;
  syncedFromServer: boolean;
  userNotified: boolean;
};

const isDevFallbackAuth = (value?: AuthSessionSeed | null) => value?.authId === 'dev-auth';

const isSameAuthState = (left: AuthUser | null, right: AuthUser) => {
  if (!left) return false;

  return (
    left.authId === right.authId &&
    left.userClientId === right.userClientId &&
    left.clientId === right.clientId &&
    left.email === right.email &&
    left.role === right.role &&
    left.status === right.status &&
    left.isVerified === right.isVerified &&
    left.isLogged === right.isLogged &&
    left.isNewUser === right.isNewUser
  );
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(message));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

interface AuthContextProps {
  auth: AuthUser;
  loading: boolean;
  source: AuthSource;
  isOffline: boolean;
  lastSyncAt: string | null;
  setAuth: (u: AuthSessionSeed) => void;
  refreshAuth: (onSessionExpired?: () => void) => Promise<AuthRefreshResult>;
  logout: () => Promise<void>;
  registerSessionCallback: (cb: () => void) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  disableUnauthenticatedBootstrap?: boolean;
  initialAuth?: AuthSessionSeed | null;
};

const isOfflineAuthError = (error: unknown): boolean => {
  const err = error as {
    code?: string;
    message?: string;
    response?: { status?: number };
  };
  const status = err?.response?.status;
  const message = err?.message?.toLowerCase() ?? '';

  if (status === 0 || status === 502 || status === 503 || status === 504) {
    return true;
  }

  if (typeof status === 'number' && status >= 500) {
    return true;
  }

  if (!status) {
    return (
      err?.code === 'ECONNABORTED' ||
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('failed')
    );
  }

  return false;
};

const isAuthDebugEnabled = (): boolean => process.env.NODE_ENV !== 'production';

const getBrowserCookiePresence = () => {
  if (typeof document === 'undefined') {
    return {
      frontendOrigin: '',
      accessTokenCookieVisibility: 'server-only/httpOnly',
      refreshTokenCookieVisibility: 'server-only/httpOnly',
      ...getCsrfDebugState(),
    };
  }

  return {
    frontendOrigin: window.location.origin,
    accessTokenCookieVisibility: 'server-only/httpOnly',
    refreshTokenCookieVisibility: 'server-only/httpOnly',
    ...getCsrfDebugState(),
  };
};

const debugAuthTrace = (
  label: string,
  payload?: Record<string, unknown> | undefined
) => {
  if (!isAuthDebugEnabled() || typeof window === 'undefined') return;
  console.debug(`[auth-debug] ${label}`, payload ?? {});
};

const unauthenticatedBootstrapByClient = new Map<string, number>();

const getUnauthenticatedBootstrapKey = (clientId?: string | null) => clientId || '__no-client__';

const markUnauthenticatedBootstrap = (clientId?: string | null) => {
  unauthenticatedBootstrapByClient.set(getUnauthenticatedBootstrapKey(clientId), Date.now());
};

const clearUnauthenticatedBootstrap = (clientId?: string | null) => {
  unauthenticatedBootstrapByClient.delete(getUnauthenticatedBootstrapKey(clientId));
};

const shouldSkipUnauthenticatedBootstrap = (clientId?: string | null): boolean => {
  const key = getUnauthenticatedBootstrapKey(clientId);
  const lastFailureAt = unauthenticatedBootstrapByClient.get(key);

  if (!lastFailureAt) {
    return false;
  }

  if (Date.now() - lastFailureAt >= AUTH_UNAUTHENTICATED_BOOTSTRAP_COOLDOWN_MS) {
    unauthenticatedBootstrapByClient.delete(key);
    return false;
  }

  return true;
};

export const AuthProvider = ({
  children,
  initialAuth = null,
  disableUnauthenticatedBootstrap = false,
}: AuthProviderProps) => {
  const { client } = useClient();
  const clientId = client?._id || '';

  const router = useRouter();
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackLogoutError, fallbackLogoutSuccess, fallbackPopups } =
    getI18nFallbacks(language);
  const popups = texts?.popups ?? {};
  const alertButtons = { ...fallbackButtons, ...popups.button };
  const { showError, showSuccess, showConfirm, closeAlert } = useGlobalAlert();
  const isDevAuthFallbackEnabled = process.env.NODE_ENV !== 'production';

  const [auth, setAuthState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [source, setSource] = useState<AuthSource>('default');
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const sessionCallbackRef = useRef<(() => void) | null>(null);
  const isRefreshingRef = useRef(false);
  const bootstrapClientKeyRef = useRef<string | null>(null);
  const lastServerSyncRef = useRef<{ authId: string; clientId: string; syncedAtMs: number } | null>(
    null
  );

  const normalizeAuthState = useCallback(
    (value?: AuthSessionSeed | null, overrides?: Partial<AuthUser>): AuthUser =>
      normalizeAuthSession(value, {
        clientId,
        ...overrides,
      }),
    [clientId]
  );

  // -------------------
  // Local Storage Utils
  // -------------------

  const loadFromStorage = (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return normalizeAuthState(JSON.parse(raw) as AuthSessionSeed);
    } catch {
      return null;
    }
  };

  const saveToStorage = (value: AuthUser | null) => {
    if (typeof window === 'undefined') return;
    if (!value) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
  };

  const markRecentLogin = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_RECENT_LOGIN_KEY, String(Date.now()));
  }, []);

  const clearRecentLogin = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_RECENT_LOGIN_KEY);
  }, []);

  const isWithinRecentLoginGrace = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const raw = localStorage.getItem(AUTH_RECENT_LOGIN_KEY);
    if (!raw) return false;

    const savedAt = Number(raw);
    if (!Number.isFinite(savedAt) || savedAt <= 0) {
      localStorage.removeItem(AUTH_RECENT_LOGIN_KEY);
      return false;
    }

    const withinGrace = Date.now() - savedAt <= AUTH_RECENT_LOGIN_GRACE_MS;
    if (!withinGrace) {
      localStorage.removeItem(AUTH_RECENT_LOGIN_KEY);
    }

    return withinGrace;
  }, []);

  const clearUserStorage = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_RECENT_LOGIN_KEY);
    localStorage.removeItem(WORKER_STORAGE_KEY);
    clearCsrfToken();
    Object.keys(localStorage)
      .filter((key) => key.startsWith('hv-profile:'))
      .forEach((key) => localStorage.removeItem(key));
  };

  // -------------------------
  // Guest factory (Auth only)
  // -------------------------

  const createGuest = useCallback((): AuthUser => {
    const stored = loadFromStorage();
    return normalizeAuthState(stored, {
      authId: '',
      userClientId: '',
      role: 'guest',
      isLogged: false,
      clientId: stored?.clientId || clientId,
    });
  }, [clientId, normalizeAuthState]);

  const createRenderGuest = useCallback(
    (): AuthUser =>
      normalizeAuthState(null, {
        authId: '',
        userClientId: '',
        role: 'guest',
        isLogged: false,
        clientId,
      }),
    [clientId, normalizeAuthState]
  );

  const createDevFallback = useCallback((): AuthUser => {
    const stored = loadFromStorage();
    return normalizeAuthState(stored, {
      authId: stored?.authId || 'dev-auth',
      userClientId: stored?.userClientId || 'dev-user',
      clientId: stored?.clientId || clientId,
      email: stored?.email || 'dev.user@havenova.local',
      role: stored?.role === 'guest' ? 'user' : stored?.role || 'user',
      status: stored?.status || 'active',
      isVerified: stored?.isVerified ?? true,
      isLogged: true,
      isNewUser: stored?.isNewUser ?? false,
    });
  }, [clientId, normalizeAuthState]);

  // -------------------
  // Init hydration guard
  // -------------------

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // -------------------
  // Persist always
  // -------------------

  useEffect(() => {
    if (!isClientReady || !auth) return;
    saveToStorage(auth);
  }, [auth, isClientReady]);

  // -------------------
  // Refresh Auth
  // -------------------

  const refreshAuth = useCallback(
    async (onSessionExpired?: () => void) => {
      const createResult = (
        nextAuth: AuthUser,
        nextSource: AuthSource,
        nextIsOffline: boolean,
        nextLastSyncAt: string | null,
        userNotified = false
      ): AuthRefreshResult => ({
        auth: nextAuth,
        source: nextSource,
        isOffline: nextIsOffline,
        lastSyncAt: nextLastSyncAt,
        syncedFromServer: nextSource === 'server' && nextAuth.isLogged && !nextIsOffline,
        userNotified,
      });

      if (!clientId || isRefreshingRef.current) {
        const currentAuth = auth ?? createGuest();
        debugAuthTrace('refreshAuth.skipped', {
          clientId,
          isRefreshing: isRefreshingRef.current,
          authRole: currentAuth.role,
          isLogged: currentAuth.isLogged,
        });
        return createResult(currentAuth, source, isOffline, lastSyncAt);
      }

      const recentServerSync = lastServerSyncRef.current;
      const shouldSkipRecentServerSync =
        auth?.isLogged &&
        auth.role !== 'guest' &&
        recentServerSync?.authId === auth.authId &&
        recentServerSync?.clientId === clientId &&
        Date.now() - recentServerSync.syncedAtMs < AUTH_SERVER_SYNC_COOLDOWN_MS;

      if (shouldSkipRecentServerSync) {
        debugAuthTrace('refreshAuth.skip-recent-server-sync', {
          clientId,
          authId: auth?.authId,
          cooldownMs: AUTH_SERVER_SYNC_COOLDOWN_MS,
        });
        return createResult(auth, source, isOffline, lastSyncAt);
      }

      isRefreshingRef.current = true;

      const stored = loadFromStorage();
      debugAuthTrace('refreshAuth.started', {
        clientId,
        storedRole: stored?.role,
        storedIsLogged: stored?.isLogged,
        ...getBrowserCookiePresence(),
      });
      const setFromBackend = (backendAuth: AuthUser) => {
        clearUnauthenticatedBootstrap(clientId);
        const finalAuth = normalizeAuthState(backendAuth, {
          isLogged: true,
          isNewUser: backendAuth.isNewUser ?? stored?.isNewUser ?? false,
        });
        setAuthState(finalAuth);
        saveToStorage(finalAuth);
        setSource('server');
        setIsOffline(false);
        const syncedAt = new Date().toISOString();
        setLastSyncAt(syncedAt);
        lastServerSyncRef.current = {
          authId: finalAuth.authId,
          clientId,
          syncedAtMs: Date.now(),
        };
        clearRecentLogin();
        debugAuthTrace('refreshAuth.server-success', {
          role: finalAuth.role,
          isLogged: finalAuth.isLogged,
          syncedAt,
          ...getBrowserCookiePresence(),
        });
        return createResult(finalAuth, 'server', false, syncedAt);
      };

      const setGuest = (offline = false) => {
        const guest = createGuest();
        setAuthState(guest);
        saveToStorage(guest);
        setSource('default');
        setIsOffline(offline);
        setLastSyncAt(null);
        lastServerSyncRef.current = null;
        clearRecentLogin();
        debugAuthTrace('refreshAuth.set-guest', {
          offline,
          ...getBrowserCookiePresence(),
        });
        return createResult(guest, 'default', offline, null);
      };

      const setFromStorage = (cachedAuth: AuthUser, offline = false) => {
        const normalized = normalizeAuthState(cachedAuth);
        setAuthState(normalized);
        const useDevFallback = isDevFallbackAuth(cachedAuth);
        setSource(useDevFallback ? 'dev-fallback' : 'storage');
        setIsOffline(useDevFallback || offline);
        setLastSyncAt(null);
        lastServerSyncRef.current = null;
        debugAuthTrace('refreshAuth.storage-fallback', {
          offline,
          role: normalized.role,
          isLogged: normalized.isLogged,
          useDevFallback,
          ...getBrowserCookiePresence(),
        });
        return createResult(
          normalized,
          useDevFallback ? 'dev-fallback' : 'storage',
          useDevFallback || offline,
          null
        );
      };

      const setDevFallback = () => {
        const devAuth = createDevFallback();
        setAuthState(devAuth);
        saveToStorage(devAuth);
        setSource('dev-fallback');
        setIsOffline(true);
        setLastSyncAt(null);
        lastServerSyncRef.current = null;
        debugAuthTrace('refreshAuth.dev-fallback', getBrowserCookiePresence());
        return createResult(devAuth, 'dev-fallback', true, null);
      };

      const handleTerminalSessionFailure = (failureStatus?: number) => {
        if (
          stored &&
          stored.isLogged &&
          stored.role !== 'guest' &&
          isWithinRecentLoginGrace()
        ) {
          return setFromStorage(stored, false);
        }

        markUnauthenticatedBootstrap(clientId);
        clearUserStorage();
        const guestResult = setGuest();
        const role = stored?.role;
        const shouldOfferContinue = role === 'user';
        const popupKey = shouldOfferContinue ? 'USER_SESSION_EXPIRED' : 'REFRESH_TOKEN_EXPIRED';
        const popup = getPopup(
          popups,
          popupKey,
          popupKey,
          shouldOfferContinue
            ? fallbackPopups.USER_SESSION_EXPIRED
            : fallbackPopups.REFRESH_TOKEN_EXPIRED
        );

        if (shouldOfferContinue) {
          showConfirm({
            response: {
              status: failureStatus || 401,
              title: popup.title,
              description: popup.description,
              confirmLabel: alertButtons.goToLogin,
              cancelLabel: alertButtons.continueBrowsing,
            },
            onConfirm: () => {
              closeAlert();
              router.push(`/${language}/user/login`);
            },
            onCancel: closeAlert,
          });
        } else {
          showError({
            response: {
              status: failureStatus || 401,
              title: popup.title,
              description: popup.description,
              cancelLabel: alertButtons.goToLogin,
            },
            onCancel: () => {
              closeAlert();
              router.push(`/${language}/user/login`);
            },
          });
        }

        (onSessionExpired || sessionCallbackRef.current)?.();
        return {
          ...guestResult,
          userNotified: true,
        };
      };

      try {
        const backendAuth = await withTimeout(
          getAuthUser(),
          AUTH_REQUEST_TIMEOUT_MS,
          'Auth bootstrap timed out.'
        );
        return setFromBackend(backendAuth);
      } catch (err: any) {
        const status = err?.response?.status;
        const code = err?.response?.data?.code;
        debugAuthTrace('refreshAuth.getAuthUser-error', {
          status,
          code,
          message: err?.message,
          ...getBrowserCookiePresence(),
        });

        // TOKEN EXPIRED
        if (status === 401 || status === 403) {
          const csrfToken = getCsrfToken();
          try {
            debugAuthTrace('refreshAuth.try-refresh-token', {
              status,
              code,
              csrfTokenSource: csrfToken ? 'memory' : 'csrf-reissue-required',
              ...getBrowserCookiePresence(),
            });
            if (!csrfToken) {
              await withTimeout(
                reissueCsrfToken(),
                AUTH_REQUEST_TIMEOUT_MS,
                'Auth CSRF reissue request timed out.'
              );
            }
            await withTimeout(
              refreshToken(),
              AUTH_REQUEST_TIMEOUT_MS,
              'Auth refresh token request timed out.'
            );
            debugAuthTrace('refreshAuth.refresh-token-success', getBrowserCookiePresence());
            const backendAuth = await withTimeout(
              getAuthUser(),
              AUTH_REQUEST_TIMEOUT_MS,
              'Auth bootstrap timed out after refresh.'
            );
            return setFromBackend(backendAuth);
          } catch (refreshError) {
            const refreshErr = refreshError as {
              response?: { status?: number; data?: { code?: string } };
              message?: string;
            };
            debugAuthTrace('refreshAuth.refresh-token-error', {
              status: refreshErr?.response?.status,
              code: refreshErr?.response?.data?.code,
              message: refreshErr?.message,
              withinRecentLoginGrace: isWithinRecentLoginGrace(),
              ...getBrowserCookiePresence(),
            });
            if (isOfflineAuthError(refreshError)) {
              if (stored) {
                return setFromStorage(stored, true);
              }
              if (isDevAuthFallbackEnabled) {
                return setDevFallback();
              }
              return setGuest(true);
            }
            return handleTerminalSessionFailure(status);
          }
        }

        // Other errors
        if (stored) {
          return setFromStorage(stored, isOfflineAuthError(err));
        }
        if (isOfflineAuthError(err) && isDevAuthFallbackEnabled) {
          return setDevFallback();
        }
        return setGuest(isOfflineAuthError(err));
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [
      auth,
      clientId,
      clearRecentLogin,
      createDevFallback,
      createGuest,
      closeAlert,
      isDevAuthFallbackEnabled,
      isOffline,
      isWithinRecentLoginGrace,
      lastSyncAt,
      language,
      popups,
      router,
      showConfirm,
      showError,
      source,
      texts,
    ]
  );

  // -------------------
  // Initial load
  // -------------------

  useEffect(() => {
    if (!isClientReady) return;

    const bootstrapKey = clientId || '__no-client__';
    if (bootstrapClientKeyRef.current === bootstrapKey) {
      return;
    }
    bootstrapClientKeyRef.current = bootstrapKey;

    const initialServerAuth = initialAuth
      ? normalizeAuthState(initialAuth, {
          isLogged: initialAuth.isLogged ?? true,
        })
      : null;

    if (initialServerAuth && initialServerAuth.isLogged && initialServerAuth.role !== 'guest') {
      setAuthState((current) =>
        isSameAuthState(current, initialServerAuth) ? current : initialServerAuth
      );
      saveToStorage(initialServerAuth);
      setSource('server');
      setIsOffline(false);
      const syncedAt = new Date().toISOString();
      setLastSyncAt(syncedAt);
      lastServerSyncRef.current = {
        authId: initialServerAuth.authId,
        clientId: initialServerAuth.clientId || clientId,
        syncedAtMs: Date.now(),
      };
      clearRecentLogin();
      setLoading(false);
      return;
    }

    const stored = loadFromStorage();
    const normalizedStored = stored ? normalizeAuthState(stored) : null;

    if (normalizedStored) {
      setAuthState((current) =>
        isSameAuthState(current, normalizedStored) ? current : normalizedStored
      );
      setSource(isDevFallbackAuth(normalizedStored) ? 'dev-fallback' : 'storage');
      setIsOffline(isDevFallbackAuth(normalizedStored));
      setLastSyncAt(null);
      lastServerSyncRef.current = null;
      if (normalizedStored.role !== 'guest') {
        if (disableUnauthenticatedBootstrap) {
          setLoading(false);
          return;
        }
        void refreshAuth().finally(() => {
          setLoading(false);
        });
        return;
      }
    } else {
      let cancelled = false;

      const bootstrapWithoutStoredSession = async () => {
        if (!clientId) {
          const guest = createGuest();
          setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
          saveToStorage(guest);
          setSource('default');
          setIsOffline(false);
          setLastSyncAt(null);
          setLoading(false);
          return;
        }

        if (disableUnauthenticatedBootstrap) {
          const guest = createGuest();
          setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
          saveToStorage(guest);
          setSource('default');
          setIsOffline(false);
          setLastSyncAt(null);
          lastServerSyncRef.current = null;
          setLoading(false);
          return;
        }

        try {
          if (shouldSkipUnauthenticatedBootstrap(clientId)) {
            debugAuthTrace('bootstrapWithoutStoredSession.skip-recent-401', {
              clientId,
              cooldownMs: AUTH_UNAUTHENTICATED_BOOTSTRAP_COOLDOWN_MS,
            });
            const guest = createGuest();
            setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
            saveToStorage(guest);
            setSource('default');
            setIsOffline(false);
            setLastSyncAt(null);
            return;
          }

          const backendAuth = await withTimeout(
            getAuthUser(),
            AUTH_REQUEST_TIMEOUT_MS,
            'Auth bootstrap timed out.'
          );

          if (cancelled) return;

          clearUnauthenticatedBootstrap(clientId);
          const normalized = normalizeAuthState(backendAuth, {
            isLogged: true,
            isNewUser: backendAuth.isNewUser ?? false,
          });
          setAuthState(normalized);
          saveToStorage(normalized);
          setSource('server');
          setIsOffline(false);
          const syncedAt = new Date().toISOString();
          setLastSyncAt(syncedAt);
          lastServerSyncRef.current = {
            authId: normalized.authId,
            clientId,
            syncedAtMs: Date.now(),
          };
        } catch (err) {
          if (cancelled) return;

          const status = (err as { response?: { status?: number } })?.response?.status;

          if (status === 401 || status === 403) {
            markUnauthenticatedBootstrap(clientId);
            const guest = createGuest();
            setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
            saveToStorage(guest);
            setSource('default');
            setIsOffline(false);
            setLastSyncAt(null);
            lastServerSyncRef.current = null;
          } else if (isOfflineAuthError(err) && isDevAuthFallbackEnabled) {
            const devAuth = createDevFallback();
            setAuthState(devAuth);
            saveToStorage(devAuth);
            setSource('dev-fallback');
            setIsOffline(true);
            setLastSyncAt(null);
            lastServerSyncRef.current = null;
          } else {
            const guest = createGuest();
            setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
            saveToStorage(guest);
            setSource('default');
            setIsOffline(isOfflineAuthError(err));
            setLastSyncAt(null);
            lastServerSyncRef.current = null;
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      void bootstrapWithoutStoredSession();
      return () => {
        cancelled = true;
      };
    }

    setLoading(false);
  }, [
    clientId,
    createDevFallback,
    createGuest,
    disableUnauthenticatedBootstrap,
    isClientReady,
    isDevAuthFallbackEnabled,
    normalizeAuthState,
    refreshAuth,
  ]);

  // -------------------
  // Logout
  // -------------------

  const performLogout = useCallback(async () => {
    try {
      await logoutUser();

      const popup = getPopup(popups, 'LOGOUT_SUCCESS', 'LOGOUT_SUCCESS', fallbackLogoutSuccess);

      showSuccess({
        response: {
          status: 200,
          title: popup.title,
          description: popup.description,
          cancelLabel: alertButtons.goToLogin,
        },
        onCancel: () => {
          closeAlert();
          router.push(`/${language}/user/login`);
        },
      });
    } catch {
      const popup = getPopup(popups, 'LOGOUT_FAILED', 'LOGOUT_FAILED', fallbackLogoutError);

      showError({
        response: {
          status: 400,
          title: popup.title,
          description: popup.description,
          cancelLabel: alertButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      clearUserStorage();
      saveToStorage(null);
      const guest = createGuest();
      setAuthState(guest);
      saveToStorage(guest);
      setSource('default');
      setIsOffline(false);
      setLastSyncAt(null);
    }
  }, [createGuest, showError, showSuccess, closeAlert, popups]);

  const logout = useCallback(async () => {
    const popup = getPopup(popups, 'LOGOUT_CONFIRM', 'LOGOUT_CONFIRM', fallbackPopups.LOGOUT_CONFIRM);

    showConfirm({
      response: {
        status: 200,
        title: popup.title,
        description: popup.description,
        confirmLabel: alertButtons.logOut,
        cancelLabel: alertButtons.close,
      },
      onConfirm: async () => {
        closeAlert();
        await performLogout();
      },
      onCancel: closeAlert,
    });
  }, [closeAlert, performLogout, popups, showConfirm]);

  // -------------------
  // API
  // -------------------

  const setAuth = useCallback((u: AuthSessionSeed) => {
    const normalized = normalizeAuthState(u);
    setAuthState(normalized);
    saveToStorage(normalized);
    setSource('storage');
    setIsOffline(false);
    setLastSyncAt(null);
    debugAuthTrace('setAuth', {
      role: normalized.role,
      isLogged: normalized.isLogged,
      userClientId: normalized.userClientId,
      clientId: normalized.clientId,
      ...getBrowserCookiePresence(),
    });

    if (normalized.isLogged && normalized.role !== 'guest') {
      clearUnauthenticatedBootstrap(normalized.clientId || clientId);
      lastServerSyncRef.current = null;
      markRecentLogin();
      return;
    }

    lastServerSyncRef.current = null;
    clearRecentLogin();
  }, [clearRecentLogin, markRecentLogin, normalizeAuthState]);

  const registerSessionCallback = useCallback((cb: () => void) => {
    sessionCallbackRef.current = cb;
  }, []);

  const authValue = auth ?? createRenderGuest();

  return (
    <AuthContext.Provider
      value={{
        auth: authValue,
        loading,
        source,
        isOffline,
        lastSyncAt,
        setAuth,
        refreshAuth,
        logout,
        registerSessionCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const useRequireRole = (expectedRole: AuthRole) => {
  const { auth, loading } = useAuth();
  const { showError, closeAlert } = useGlobalAlert();
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackPopups } = getI18nFallbacks(language);
  const router = useRouter();
  const didNotifyRef = useRef(false);

  const isAllowed = Boolean(
    auth?.isLogged &&
      (auth.role === expectedRole ||
        (expectedRole === 'admin' && auth.role === 'super_admin'))
  );

  useEffect(() => {
    if (!auth || loading || isAllowed || didNotifyRef.current) return;
    didNotifyRef.current = true;

    const popups = texts?.popups ?? {};
    const popup = getPopup(
      popups,
      'PERMISSION_DENIED',
      'PERMISSION_DENIED',
      fallbackPopups.PERMISSION_DENIED
    );

    showError({
      response: {
        status: 403,
        title: popup.title,
        description: popup.description,
        cancelLabel: (texts?.popups?.button ?? fallbackButtons).goToLogin,
      },
      onCancel: () => {
        closeAlert();
        router.push(`/${language}/user/login`);
      },
    });
  }, [auth, loading, isAllowed, texts, language, router, showError, closeAlert, expectedRole]);

  return isAllowed;
};
