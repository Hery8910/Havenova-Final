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
import { refreshToken, logoutUser, getAuthUser } from '@/packages/services/auth/authService';
import { useGlobalAlert } from '../alert';
import { useI18n } from '@havenova/contexts/i18n';
import { getPopup } from '@/packages/utils/alertType';
import { fallbackLogoutSuccess } from '../i18n';
import { AuthUser } from '@/packages/types/auth/authTypes';

const AUTH_STORAGE_KEY = 'hv-auth';

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

  const { texts } = useI18n();
  const popups = texts.popups;
  const { showError, showSuccess, closeAlert } = useGlobalAlert();

  const [auth, setAuthState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  const sessionCallbackRef = useRef<(() => void) | null>(null);

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

  // -------------------------
  // Guest factory (Auth only)
  // -------------------------

  const createGuest = useCallback((): AuthUser => {
    return {
      userId: '',
      clientId,
      email: '',
      role: 'guest',
      isLogged: false,
      isVerified: false,
      status: 'active',
      cookiePrefs: undefined,
    };
  }, [clientId]);

  // -------------------
  // Init hydration guard
  // -------------------

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // -------------------
  // Initial load
  // -------------------

  useEffect(() => {
    if (!isClientReady) return;

    const stored = loadFromStorage();

    if (stored) {
      setAuthState(stored);
    } else {
      const guest = createGuest();
      setAuthState(guest);
      saveToStorage(guest);
    }

    setLoading(false);
  }, [isClientReady, createGuest]);

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
      if (!clientId) return;

      const stored = loadFromStorage();
      const setFromBackend = (backendAuth: AuthUser) => {
        const finalAuth = { ...backendAuth };
        setAuthState(finalAuth);
        saveToStorage(finalAuth);
      };

      const setGuest = () => {
        const guest = createGuest();
        setAuthState(guest);
        saveToStorage(guest);
      };

      try {
        const backendAuth = await getAuthUser(clientId);
        setFromBackend(backendAuth);
      } catch (err: any) {
        const status = err?.response?.status;

        // TOKEN EXPIRED
        if (status === 401 || status === 403) {
          try {
            await refreshToken();
            const backendAuth = await getAuthUser(clientId);
            setFromBackend(backendAuth);
            return;
          } catch {
            setGuest();
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
      }
    },
    [clientId, createGuest]
  );

  // -------------------
  // Logout
  // -------------------

  const logout = useCallback(async () => {
    try {
      await logoutUser();

      const popup = getPopup(popups, 'LOGOUT_SUCCESS', 'LOGOUT_SUCCESS', fallbackLogoutSuccess);

      showSuccess({
        response: {
          status: 200,
          title: popup.title,
          description: popup.description,
          cancelLabel: popups.button.close,
        },
      });
    } catch {
      const popup = getPopup(popups, 'LOGOUT_FAILED', 'LOGOUT_FAILED', fallbackLogoutSuccess);

      showError({
        response: {
          status: 400,
          title: popup.title,
          description: popup.description,
          cancelLabel: popups.button.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      const guest = createGuest();
      setAuthState(guest);
      saveToStorage(guest);
    }
  }, [createGuest, showError, showSuccess, closeAlert, popups]);

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
