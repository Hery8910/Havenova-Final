'use client';

import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from 'react';

import { useAuth } from '../auth/authContext';
import { getUserClientProfile, createOrUpdateUserClientProfile } from '@/packages/services/profile';

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
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { auth, setAuth } = useAuth();
  const clientId = auth.clientId;

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
    profileImage: previous?.profileImage,
    language: previous?.language ?? 'de',
    theme: previous?.theme ?? 'light',
  });

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
    if (!auth.isLogged || auth.role === 'guest') return;

    try {
      const backendProfile = await getUserClientProfile(clientId);
      const merged = { ...createLocalDefault(profile), ...backendProfile };
      setProfile(merged);
      saveToStorage(merged);

      // Ya no es usuario nuevo
      if (auth.isNewUser) {
        setAuth({ ...auth, isNewUser: false });
      }
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 404 && auth.isNewUser) {
        // Crear perfil inicial automáticamente
        const initialProfile: UserClientProfile = {
          name: '', // si quieres: auth.nameFromRegister
          language: profile?.language ?? 'de',
          theme: profile?.theme ?? 'light',
        };

        const payload: UpdateUserProfilePayload = {
          clientId,
          role: auth.role,
          ...initialProfile,
        };

        await createOrUpdateUserClientProfile(payload);

        const newBackend = await getUserClientProfile(clientId);
        setProfile({ ...initialProfile, ...newBackend });
        saveToStorage({ ...initialProfile, ...newBackend });

        setAuth({ ...auth, isNewUser: false });
        return;
      }

      // Otros errores → no tocamos nada
    }
  }, [auth, clientId, profile, setAuth]);

  // Cuando usuario pasa de guest → logged
  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    reloadProfile();
  }, [auth.isLogged, auth.role]);

  // -------------------
  // Update profile
  // -------------------

  const updateProfile = useCallback(
    async (patch: Partial<UserClientProfile>) => {
      if (!profile) return;

      const updatedLocal = { ...profile, ...patch };
      setProfile(updatedLocal);
      saveToStorage(updatedLocal);

      // Solo sincronizar si está logeado
      if (auth.isLogged && auth.role !== 'guest') {
        const payload: UpdateUserProfilePayload = {
          clientId,
          role: auth.role,
          ...updatedLocal,
        };
        await createOrUpdateUserClientProfile(payload);
      }
    },
    [auth, clientId, profile]
  );

  const setLanguage = (lang: string) => updateProfile({ language: lang });
  const setTheme = (theme: ThemeMode) => updateProfile({ theme });

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
