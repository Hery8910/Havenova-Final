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
import { fallbackButtons, fallbackLogoutSuccess, fallbackPopups } from '../i18n';
import { AuthRole, AuthUser } from '@/packages/types/auth/authTypes';
import { useRouter } from 'next/navigation';
import { getPopup } from '@havenova/utils';
import { getAuthUser, logoutUser, refreshToken } from '@havenova/services';

const AUTH_STORAGE_KEY = 'hv-auth';
const PROFILE_STORAGE_KEY = 'hv-profile';
const WORKER_STORAGE_KEY = 'hv-worker-profile';

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
  const popups = texts.popups;
  const { showError, showSuccess, showConfirm, closeAlert } = useGlobalAlert();

  const [auth, setAuthState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  const sessionCallbackRef = useRef<(() => void) | null>(null);
  const isRefreshingRef = useRef(false);

  // -------------------
  // Local Storage Utils
  // -------------------

  const loadFromStorage = (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
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
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(WORKER_STORAGE_KEY);
  };

  // -------------------------
  // Guest factory (Auth only)
  // -------------------------

  const createGuest = useCallback((): AuthUser => {
    // Si hay datos previos, úsalos como base (similar a createLocalDefault en perfil)
    const stored = loadFromStorage();
    const base: Partial<AuthUser> = stored
      ? {
          userId: stored.userId,
          clientId: stored.clientId,
          email: stored.email,
          role: stored.role,
          status: stored.status,
          isVerified: stored.isVerified,
          cookiePrefs: stored.cookiePrefs,
          isNewUser: stored.isNewUser,
        }
      : {};

    return {
      userId: base.userId || '',
      clientId: base.clientId || clientId,
      email: base.email || '',
      role: base.role || 'guest',
      isLogged: false,
      isVerified: base.isVerified ?? false,
      status: base.status || 'active',
      cookiePrefs: base.cookiePrefs,
      isNewUser: base.isNewUser ?? true,
    };
  }, [clientId]);

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
        const finalAuth = { ...backendAuth, isLogged: true, isNewUser: false };
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
          setAuthState(stored);
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

    if (stored) {
      setAuthState(stored);
      // Si ya existía en storage y no es guest, no es un usuario nuevo
      if (stored.role !== 'guest') {
        setAuthState({ ...stored, isNewUser: false });
      }
      if (stored.role !== 'guest') {
        setLoading(true);
        refreshAuth().finally(() => setLoading(false));
        return;
      }
    } else {
      const guest = createGuest();
      setAuthState(guest);
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
      const popup = getPopup(popups, 'LOGOUT_FAILED', 'LOGOUT_FAILED', fallbackLogoutSuccess);

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
      setTimeout(() => {
        saveToStorage(null);
        const guest = createGuest();
        setAuthState(guest);
        saveToStorage(guest);
      }, 5000);
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

  const setAuth = (u: AuthUser) => {
    setAuthState(u);
    saveToStorage(u);
  };

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
