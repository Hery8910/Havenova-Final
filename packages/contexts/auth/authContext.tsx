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

type PartialAuthUser = Partial<AuthUser> & {
  authId?: string;
  userClientId?: string;
  userId?: string;
};

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

interface AuthContextProps {
  auth: AuthUser;
  loading: boolean;
  setAuth: (u: AuthUser) => void;
  refreshAuth: (onSessionExpired?: () => void) => Promise<void>;
  logout: () => Promise<void>;
  registerSessionCallback: (cb: () => void) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { client } = useClient();
  const clientId = client?._id || '';

  const router = useRouter();
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackLogoutError, fallbackLogoutSuccess, fallbackPopups } =
    getI18nFallbacks(language);
  const popups = texts.popups;
  const { showError, showSuccess, showConfirm, closeAlert } = useGlobalAlert();

  const [auth, setAuthState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

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
          isNewUser: false,
        });
        setAuthState(finalAuth);
        saveToStorage(finalAuth);
      };

      const setGuest = () => {
        const guest = createGuest();
        setAuthState(guest);
        saveToStorage(guest);
      };

      try {
        const backendAuth = await getAuthUser();
        setFromBackend(backendAuth);
      } catch (err: any) {
        const status = err?.response?.status;

        // TOKEN EXPIRED
        if (status === 401 || status === 403) {
          try {
            await refreshToken();
            const backendAuth = await getAuthUser();
            setFromBackend(backendAuth);
            return;
          } catch {
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
                  confirmLabel:
                    popup.confirm ?? texts.popups?.button?.continue ?? fallbackButtons.continue,
                  cancelLabel: popup.close ?? fallbackButtons.close,
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
                  cancelLabel: popup.close ?? fallbackButtons.close,
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
          setAuthState(normalizeAuthState(stored));
          return;
        }
        setGuest();
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [clientId, createGuest, closeAlert, language, popups, router, showConfirm, showError, texts]
  );

  // -------------------
  // Initial load
  // -------------------

  useEffect(() => {
    if (!isClientReady) return;

    const stored = loadFromStorage();
    const normalizedStored = stored ? normalizeAuthState(stored) : null;

    if (normalizedStored) {
      setAuthState((current) => (isSameAuthState(current, normalizedStored) ? current : normalizedStored));
      if (stored.role !== 'guest') {
        setLoading(true);
        refreshAuth().finally(() => setLoading(false));
        return;
      }
    } else {
      const guest = createGuest();
      setAuthState((current) => (isSameAuthState(current, guest) ? current : guest));
      saveToStorage(guest);
    }

    setLoading(false);
  }, [isClientReady, createGuest, refreshAuth]);

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
          cancelLabel: popups.button?.close ?? fallbackButtons.close,
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
          cancelLabel: popups.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      clearUserStorage();
      saveToStorage(null);
      const guest = createGuest();
      setAuthState(guest);
      saveToStorage(guest);
    }
  }, [createGuest, showError, showSuccess, closeAlert, popups]);

  const logout = useCallback(async () => {
    const popup = getPopup(popups, 'LOGOUT_CONFIRM', 'LOGOUT_CONFIRM', fallbackPopups.LOGOUT_CONFIRM);

    showConfirm({
      response: {
        status: 200,
        title: popup.title,
        description: popup.description,
        confirmLabel: popup.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
        cancelLabel: popup.close ?? popups.button?.close ?? fallbackButtons.close,
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
  }, [normalizeAuthState]);

  const registerSessionCallback = useCallback((cb: () => void) => {
    sessionCallbackRef.current = cb;
  }, []);

  if (!isClientReady || loading || !auth) return null;

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
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
  const { fallbackPopups } = getI18nFallbacks(language);
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
        cancelLabel: popup.close ?? fallbackPopups.PERMISSION_DENIED.close,
      },
      onCancel: () => {
        closeAlert();
        router.push(`/${language}/user/login`);
      },
    });
  }, [auth, loading, isAllowed, texts, language, router, showError, closeAlert, expectedRole]);

  return isAllowed;
};
