// src/contexts/user/UserContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from 'react';

import { useClient } from '../client/ClientContext';
import { getUserClient, logoutUser as apiLogoutUser } from '../../services/user/userService';

import {
  saveUserToStorage,
  getUserFromStorage,
  loadProfileByRoles,
  updateProfileByRoles,
} from '../../utils/user/userUtils';

import { FrontendUser, UpdateUserProfilePayload } from '../../types/user/userTypes';
import { useGlobalAlert } from '../alert';
import { useI18n } from '../i18n';

interface UserContextProps {
  user: FrontendUser | null;
  loading: boolean;

  setUser: (u: FrontendUser | null) => void;
  refreshUser: (onSessionExpired?: () => void) => Promise<void>;
  logout: () => Promise<void>;

  updateUserProfile: (patch: Partial<UpdateUserProfilePayload>) => Promise<void>;
  updateUserLanguage: (lang: string) => Promise<void>;
  updateUserTheme: (theme: 'light' | 'dark') => Promise<void>;

  registerSessionCallback: (cb: () => void) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const { client } = useClient();
  const clientId = client?._id || '';

  const { texts } = useI18n();
  const logoutTexts = texts?.message?.logout;

  const { showError, showSuccess, closeAlert } = useGlobalAlert();

  const [user, setUser] = useState<FrontendUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 FIX: prevenir lectura de localStorage antes de hidratar
  const [isClientReady, setIsClientReady] = useState(false);

  const sessionCallbackRef = useRef<(() => void) | null>(null);

  //------------------------------------------------------------------
  //  ✔ GUEST FACTORY
  //------------------------------------------------------------------
  const createGuest = useCallback(
    (
      preferredLanguage?: string,
      preferredTheme?: 'light' | 'dark',
      previousUser?: FrontendUser | null
    ): FrontendUser => ({
      userId: '',
      clientId,
      email: '',
      isVerified: false,
      role: 'guest',
      language: preferredLanguage ?? previousUser?.language ?? 'de',
      theme: preferredTheme ?? previousUser?.theme ?? 'light',
      isLogged: false,
    }),
    [clientId]
  );

  //------------------------------------------------------------------
  //  1. Cliente listo → marcar Estado para permitir localStorage
  //------------------------------------------------------------------
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  //------------------------------------------------------------------
  //  2. CARGA LOCAL INICIAL (solo cuando cliente está listo)
  //------------------------------------------------------------------
  useEffect(() => {
    if (!isClientReady) return;

    const stored = getUserFromStorage();

    if (stored) {
      setUser(stored);
    } else {
      const guest = createGuest(undefined, undefined, null);
      setUser(guest);
      saveUserToStorage(guest);
    }

    setLoading(false);
  }, [isClientReady, createGuest]);

  //------------------------------------------------------------------
  //  3. REFRESCAR user DESDE BACKEND SOLO UNA VEZ (no por idioma)
  //------------------------------------------------------------------
  useEffect(() => {
    if (!clientId) return;
    if (!user) return;

    if (user.role !== 'guest') {
      refreshUser();
    }
    // Se ejecuta una sola vez: cuando user está cargado y tiene rol válido
  }, [user?.role]);

  //------------------------------------------------------------------
  //  4. PERSISTIR USER SIEMPRE
  //------------------------------------------------------------------
  useEffect(() => {
    if (!isClientReady) return;
    saveUserToStorage(user);
  }, [user, isClientReady]);

  //------------------------------------------------------------------
  //  REFRESH USER DESDE BACKEND
  //------------------------------------------------------------------
  const refreshUser = useCallback(
    async (onSessionExpired?: () => void) => {
      if (!clientId) return;
      if (user?.role === 'guest') return; // No refrescar guest

      try {
        const response = await getUserClient(clientId);
        const authUser = response.data;

        if (!authUser || !authUser.userId) {
          throw new Error('Invalid auth user payload');
        }

        const profile = await loadProfileByRoles(authUser.role, clientId);

        const baseUser: FrontendUser = {
          ...authUser,
          ...profile,
          isLogged: true,
        };

        setUser((prev) => {
          const merged: FrontendUser = {
            ...baseUser,
            language: prev?.language ?? baseUser.language,
            theme: prev?.theme ?? baseUser.theme,
          };
          saveUserToStorage(merged);
          return merged;
        });
      } catch (err: any) {
        const status = err?.response?.status;
        const stored = getUserFromStorage();

        if (stored && (status === 401 || status === 403)) {
          saveUserToStorage(null);
          setUser(null);

          if (onSessionExpired) onSessionExpired();
          else sessionCallbackRef.current?.();

          const guest = createGuest(stored.language, stored.theme, stored);
          setUser(guest);
          saveUserToStorage(guest);
        } else {
          if (stored) {
            setUser(stored);
            return;
          }

          const guest = createGuest(undefined, undefined, null);
          setUser(guest);
          saveUserToStorage(guest);
        }
      }
    },
    [clientId, user, createGuest]
  );

  //------------------------------------------------------------------
  //  UPDATE PROFILE
  //------------------------------------------------------------------
  const updateUserProfile = useCallback(
    async (patch: Partial<UpdateUserProfilePayload>) => {
      if (!clientId) return;

      const isGuest = user?.role === 'guest';

      // Guest → solo actualizar local
      if (!user || isGuest) {
        setUser((prev) => {
          const base = prev ?? createGuest(patch.language, patch.theme, null);

          const updated: FrontendUser = {
            ...base,
            language: patch.language ?? base.language,
            theme: patch.theme ?? base.theme,
          };

          saveUserToStorage(updated);
          return updated;
        });
        return;
      }

      // Usuario logeado
      try {
        const payload: UpdateUserProfilePayload = {
          clientId,
          role: user.role,
          ...patch,
        };

        const profileData = await updateProfileByRoles(payload);

        const finalUser: FrontendUser = {
          ...user,
          ...profileData,
          language: patch.language ?? user.language,
          theme: patch.theme ?? user.theme,
          isLogged: true,
        };

        setUser(finalUser);
        saveUserToStorage(finalUser);
      } catch (err) {
        console.error('Failed to update user profile:', err);
      }
    },
    [user, clientId, createGuest]
  );

  //------------------------------------------------------------------
  //  SHORTCUTS
  //------------------------------------------------------------------
  const updateUserLanguage = useCallback(
    (lang: string) => updateUserProfile({ language: lang }),
    [updateUserProfile]
  );

  const updateUserTheme = useCallback(
    (theme: 'light' | 'dark') => updateUserProfile({ theme }),
    [updateUserProfile]
  );

  //------------------------------------------------------------------
  //  LOGOUT
  //------------------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      await apiLogoutUser();
      showSuccess({
        response: {
          status: 200,
          title: logoutTexts.title,
          description: logoutTexts.description,
          cancelLabel: logoutTexts.close,
        },
      });
    } catch (error) {
      showError({
        response: {
          status: 400,
          title: logoutTexts.errorTexts.title,
          description: logoutTexts.errorTexts.description,
          cancelLabel: logoutTexts.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      const guest = createGuest(user?.language, user?.theme, user);
      setUser(guest);
      saveUserToStorage(guest);
    }
  }, [createGuest, showError, showSuccess, closeAlert, logoutTexts, user]);

  //------------------------------------------------------------------
  const registerSessionCallback = useCallback((cb: () => void) => {
    sessionCallbackRef.current = cb;
  }, []);

  //------------------------------------------------------------------
  //  NO RENDERIZAR hasta que localStorage esté listo
  //------------------------------------------------------------------
  if (!isClientReady || loading) return null;

  //------------------------------------------------------------------
  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        setUser,
        refreshUser,
        logout,
        updateUserProfile,
        updateUserLanguage,
        updateUserTheme,
        registerSessionCallback,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
