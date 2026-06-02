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
import { AuthRole, AuthUser } from '@/packages/types/auth/authTypes';
import { useRouter } from 'next/navigation';
import { getPopup } from '@havenova/utils';
import { getAuthUser, logoutUser, refreshToken } from '@havenova/services';

const AUTH_STORAGE_KEY = 'hv-auth';
const WORKER_STORAGE_KEY = 'hv-worker-profile';
const AUTH_REQUEST_TIMEOUT_MS = 8000;

type PartialAuthUser = Partial<AuthUser> & {
  authId?: string;
  userClientId?: string;
  userId?: string;
};

const isDevFallbackAuth = (value?: PartialAuthUser | null) => value?.authId === 'dev-auth';

const isSameAuthState = (left: AuthUser | null, right: AuthUser) => {
  if (!left) return false;

  return (
    left.authId === right.authId &&
    left.userClientId === right.userClientId &&
    left.userId === right.userId &&
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
  source: 'server' | 'storage' | 'default' | 'dev-fallback';
  isOffline: boolean;
  lastSyncAt: string | null;
  setAuth: (u: AuthUser) => void;
  refreshAuth: (onSessionExpired?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  registerSessionCallback: (cb: () => void) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { client } = useClient();
  const clientId = client?._id || '';

  const router = useRouter();
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackLogoutError, fallbackLogoutSuccess, fallbackPopups } =
    getI18nFallbacks(language);
  const popups = texts.popups;
  const alertButtons = popups.button ?? fallbackButtons;
  const { showError, showSuccess, showConfirm, closeAlert } = useGlobalAlert();
  const isDevAuthFallbackEnabled = process.env.NODE_ENV !== 'production';

  const [auth, setAuthState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [source, setSource] = useState<'server' | 'storage' | 'default' | 'dev-fallback'>(
    'default'
  );
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const sessionCallbackRef = useRef<(() => void) | null>(null);
  const isRefreshingRef = useRef(false);

  const normalizeAuthState = useCallback(
    (value?: PartialAuthUser | null, overrides?: Partial<AuthUser>): AuthUser => {
      const sessionIdentity = value?.userClientId || value?.userId || '';

      return {
        authId: value?.authId || '',
        userClientId: sessionIdentity,
        userId: sessionIdentity,
        clientId: value?.clientId || clientId,
        email: value?.email || '',
        role: value?.role || 'guest',
        status: value?.status || 'active',
        isVerified: value?.isVerified ?? false,
        isLogged: value?.isLogged ?? false,
        isNewUser: value?.isNewUser ?? true,
        tosAccepted: value?.tosAccepted,
        cookiePrefs: value?.cookiePrefs,
        ...overrides,
      };
    },
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
      return normalizeAuthState(JSON.parse(raw) as PartialAuthUser);
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

  const clearUserStorage = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(WORKER_STORAGE_KEY);
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
      userId: '',
      role: 'guest',
      isLogged: false,
      clientId: stored?.clientId || clientId,
    });
  }, [clientId, normalizeAuthState]);

  const createDevFallback = useCallback((): AuthUser => {
    const stored = loadFromStorage();
    return normalizeAuthState(stored, {
      authId: stored?.authId || 'dev-auth',
      userClientId: stored?.userClientId || stored?.userId || 'dev-user',
      userId: stored?.userId || stored?.userClientId || 'dev-user',
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
      if (!clientId || isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      const stored = loadFromStorage();
      const setFromBackend = (backendAuth: AuthUser) => {
        const finalAuth = normalizeAuthState(backendAuth, {
          isLogged: true,
          isNewUser: backendAuth.isNewUser ?? stored?.isNewUser ?? false,
        });
        setAuthState(finalAuth);
        saveToStorage(finalAuth);
        setSource('server');
        setIsOffline(false);
        setLastSyncAt(new Date().toISOString());
      };

      const setGuest = (offline = false) => {
        const guest = createGuest();
        setAuthState(guest);
        saveToStorage(guest);
        setSource('default');
        setIsOffline(offline);
        setLastSyncAt(null);
      };

      const setFromStorage = (cachedAuth: AuthUser, offline = false) => {
        setAuthState(normalizeAuthState(cachedAuth));
        const useDevFallback = isDevFallbackAuth(cachedAuth);
        setSource(useDevFallback ? 'dev-fallback' : 'storage');
        setIsOffline(useDevFallback || offline);
        setLastSyncAt(null);
      };

      const setDevFallback = () => {
        const devAuth = createDevFallback();
        setAuthState(devAuth);
        saveToStorage(devAuth);
        setSource('dev-fallback');
        setIsOffline(true);
        setLastSyncAt(null);
      };

      try {
        const backendAuth = await withTimeout(
          getAuthUser(),
          AUTH_REQUEST_TIMEOUT_MS,
          'Auth bootstrap timed out.'
        );
        setFromBackend(backendAuth);
      } catch (err: any) {
        const status = err?.response?.status;

        // TOKEN EXPIRED
        if (status === 401 || status === 403) {
          try {
            await withTimeout(
              refreshToken(),
              AUTH_REQUEST_TIMEOUT_MS,
              'Auth refresh token request timed out.'
            );
            const backendAuth = await withTimeout(
              getAuthUser(),
              AUTH_REQUEST_TIMEOUT_MS,
              'Auth bootstrap timed out after refresh.'
            );
            setFromBackend(backendAuth);
            return;
          } catch (refreshError) {
            if (isOfflineAuthError(refreshError)) {
              if (stored) {
                setFromStorage(stored, true);
                return;
              }
              if (isDevAuthFallbackEnabled) {
                setDevFallback();
                return;
              }
              setGuest(true);
              return;
            }

            clearUserStorage();
            setGuest();
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
                  status: status || 401,
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
                  status: status || 401,
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
            return;
          }
        }

        // Other errors
        if (stored) {
          setFromStorage(stored, isOfflineAuthError(err));
          return;
        }
        if (isOfflineAuthError(err) && isDevAuthFallbackEnabled) {
          setDevFallback();
          return;
        }
        setGuest(isOfflineAuthError(err));
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [
      clientId,
      createDevFallback,
      createGuest,
      closeAlert,
      isDevAuthFallbackEnabled,
      language,
      popups,
      router,
      showConfirm,
      showError,
      texts,
    ]
  );

  // -------------------
  // Initial load
  // -------------------

  useEffect(() => {
    if (!isClientReady) return;

    const stored = loadFromStorage();
    const normalizedStored = stored ? normalizeAuthState(stored) : null;

    if (normalizedStored) {
      setAuthState((current) =>
        isSameAuthState(current, normalizedStored) ? current : normalizedStored
      );
      setSource(isDevFallbackAuth(normalizedStored) ? 'dev-fallback' : 'storage');
      setIsOffline(isDevFallbackAuth(normalizedStored));
      setLastSyncAt(null);
      if (normalizedStored.role !== 'guest') {
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

        try {
          const backendAuth = await withTimeout(
            getAuthUser(),
            AUTH_REQUEST_TIMEOUT_MS,
            'Auth bootstrap timed out.'
          );

          if (cancelled) return;

          const normalized = normalizeAuthState(backendAuth, {
            isLogged: true,
            isNewUser: backendAuth.isNewUser ?? false,
          });
          setAuthState(normalized);
          saveToStorage(normalized);
          setSource('server');
          setIsOffline(false);
          setLastSyncAt(new Date().toISOString());
        } catch (err) {
          if (cancelled) return;

          const status = (err as { response?: { status?: number } })?.response?.status;

          if (status === 401 || status === 403) {
            const guest = createGuest();
            setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
            saveToStorage(guest);
            setSource('default');
            setIsOffline(false);
            setLastSyncAt(null);
          } else if (isOfflineAuthError(err) && isDevAuthFallbackEnabled) {
            const devAuth = createDevFallback();
            setAuthState(devAuth);
            saveToStorage(devAuth);
            setSource('dev-fallback');
            setIsOffline(true);
            setLastSyncAt(null);
          } else {
            const guest = createGuest();
            setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
            saveToStorage(guest);
            setSource('default');
            setIsOffline(isOfflineAuthError(err));
            setLastSyncAt(null);
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

  const setAuth = useCallback((u: AuthUser) => {
    const normalized = normalizeAuthState(u);
    setAuthState(normalized);
    saveToStorage(normalized);
    setSource('storage');
    setIsOffline(false);
  }, [normalizeAuthState]);

  const registerSessionCallback = useCallback((cb: () => void) => {
    sessionCallbackRef.current = cb;
  }, []);

  const authValue = auth ?? createGuest();

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

  const isAllowed = Boolean(auth?.isLogged && auth.role === expectedRole);

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
