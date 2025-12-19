'use client';

import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  ReactNode,
} from 'react';

import { useAuth } from '../auth/authContext';
import {
  getUserClientProfile,
  createUserClientProfile,
  updateUserClientProfile,
} from '@/packages/services/profile';
import { refreshToken } from '@/packages/services/auth/authService';
import Cookies from 'js-cookie';

import { UserClientProfile, ThemeMode } from '@/packages/types/profile/profileTypes';
import { UpdateUserProfilePayload } from '@/packages/types/profile/profileTypes';

const PROFILE_STORAGE_KEY = 'hv-profile';

interface ProfileContextProps {
  profile: UserClientProfile;
  loading: boolean;

  reloadProfile: () => Promise<void>;
  updateProfile: (patch: Partial<UserClientProfile>) => Promise<void>;

  setLanguage: (lang: string) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { auth, setAuth } = useAuth();
  const clientId = auth.clientId;
  const creatingProfileRef = useRef(false);

  const [profile, setProfile] = useState<UserClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);

  // -------------------
  // Local Storage Utils
  // -------------------

  const loadFromStorage = (): UserClientProfile | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as UserClientProfile;
    } catch {
      return null;
    }
  };

  const saveToStorage = (value: UserClientProfile | null) => {
    if (typeof window === 'undefined') return;
    if (!value) {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      return;
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(value));
  };

  // -------------------
  // Default local profile
  // -------------------

  const createLocalDefault = (previous?: UserClientProfile | null): UserClientProfile => ({
    name: previous?.name,
    phone: previous?.phone,
    address: previous?.address,
    profileImage: previous?.profileImage ?? '/avatars/avatar-1.svg',
    language: previous?.language ?? 'de',
    theme: previous?.theme ?? 'light',
  });

  const getStoredTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  };

  const getStoredLanguage = (): string | null => {
    if (typeof window === 'undefined') return null;
    const stored = Cookies.get('lang');
    return stored === 'de' || stored === 'en' ? stored : null;
  };

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
      setProfile(stored);
    } else {
      const local = createLocalDefault(null);
      setProfile(local);
      saveToStorage(local);
    }

    setLoading(false);
  }, [isClientReady]);

  // -------------------
  // Persist local
  // -------------------

  useEffect(() => {
    if (!isClientReady || !profile) return;
    saveToStorage(profile);
  }, [profile, isClientReady]);

  // -------------------
  // Reload profile from backend
  // -------------------

  const reloadProfile = useCallback(async () => {
    if (!auth.isLogged || auth.role === 'guest' || !clientId) return;

    try {
      const backendProfile = await getUserClientProfile();
      const merged = { ...createLocalDefault(profile), ...backendProfile };
      setProfile(merged);
      saveToStorage(merged);

      // Ya no es usuario nuevo
      if (auth.isNewUser) {
        setAuth({ ...auth, isNewUser: false });
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;

      if (
        (status === 404 || code === 'USER_CLIENT_PROFILE_NOT_FOUND') &&
        auth.isNewUser &&
        !creatingProfileRef.current
      ) {
        creatingProfileRef.current = true;

        try {
          // Crear perfil inicial automáticamente
          const initialProfile: UserClientProfile = {
            name: profile?.name || '',
            language: profile?.language ?? 'de',
            theme: profile?.theme ?? 'light',
          };

          const payload: UpdateUserProfilePayload = {
            clientId,
            role: auth.role,
            ...initialProfile,
          };

          const created = await createUserClientProfile(payload);
          const newProfile = { ...initialProfile, ...created.profile };

          setProfile(newProfile);
          saveToStorage(newProfile);

          setAuth({ ...auth, isNewUser: false });
        } finally {
          creatingProfileRef.current = false;
        }
        return;
      }

      // Si el token expiró, intenta refrescar y reintenta una vez
      if (status === 401 || status === 403) {
        try {
          await refreshToken();
          const backendProfile = await getUserClientProfile();
          const merged = { ...createLocalDefault(profile), ...backendProfile };
          setProfile(merged);
          saveToStorage(merged);

          if (auth.isNewUser) {
            setAuth({ ...auth, isNewUser: false });
          }
        } catch {
          // si vuelve a fallar, no hacemos nada (AuthContext debería manejar la sesión)
        }
      }

      // Otros errores → no tocamos nada
    }
  }, [auth, clientId, profile, setAuth]);

  // Cuando usuario pasa de guest → logged
  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    reloadProfile();
  }, [auth.isLogged, auth.role]);

  // Cuando usuario hace logout → volver a perfil guest/default
  useEffect(() => {
    if (!isClientReady) return;
    if (auth.isLogged && auth.role !== 'guest') return;
    const lastProfile = profile ?? loadFromStorage();
    const local = {
      ...createLocalDefault(lastProfile),
      name: '',
      phone: '',
      address: '',
      language: lastProfile?.language ?? getStoredLanguage() ?? 'de',
      theme: lastProfile?.theme ?? getStoredTheme() ?? 'light',
    };
    setProfile(local);
    saveToStorage(local);
  }, [auth.isLogged, auth.role, isClientReady, profile]);

  // -------------------
  // Update profile
  // -------------------

  const updateProfile = useCallback(
    async (patch: Partial<UserClientProfile>) => {
      if (!profile) return;

      const updatedLocal = { ...profile, ...patch };
      setProfile(updatedLocal);
      saveToStorage(updatedLocal);
      reloadProfile();
      // Solo sincronizar si está logeado
      if (auth.isLogged && auth.role !== 'guest') {
        const payload: UpdateUserProfilePayload = {
          clientId,
          role: auth.role,
          ...updatedLocal,
        };
        try {
          await updateUserClientProfile(payload);
          reloadProfile();
        } catch (err: any) {
          const status = err?.response?.status;

          if (status === 401 || status === 403) {
            try {
              await refreshToken();
              await updateUserClientProfile(payload);
            } catch {
              // si vuelve a fallar, no hacemos nada; AuthContext se encargará de la sesión
            }
          }
        }
      }
    },
    [auth, clientId, profile]
  );

  const setLanguage = (lang: string) => updateProfile({ language: lang });
  const setTheme = (theme: ThemeMode) => updateProfile({ theme });
  const setProfileImage = (profileImage: string) => updateProfile({ profileImage });

  if (!isClientReady || loading || !profile) return null;

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        reloadProfile,
        updateProfile,
        setLanguage,
        setTheme,
        setProfileImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
