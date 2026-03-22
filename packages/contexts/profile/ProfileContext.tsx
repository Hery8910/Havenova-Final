'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { refreshToken } from '@havenova/services';
import { useAuth } from '../auth/authContext';
import type {
  AppLanguage,
  CreateUserClientProfileInput,
  ThemeMode,
  UpdateUserClientProfileInput,
  UserClientProfile,
} from '@/packages/types/profile/profileTypes';
import {
  createUserClientProfile,
  getUserClientProfile,
  updateUserClientProfile,
} from '@havenova/services';

interface ProfileContextProps {
  profile: UserClientProfile;
  loading: boolean;
  reloadProfile: () => Promise<void>;
  updateProfile: (patch: UpdateUserClientProfileInput) => Promise<void>;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

const DEFAULT_AVATAR = '/avatars/avatar-1.svg';

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
};

const getStoredLanguage = (): AppLanguage | null => {
  if (typeof window === 'undefined') return null;
  const stored = Cookies.get('lang');
  return stored === 'de' || stored === 'en' ? stored : null;
};

const createEmptyProfile = (overrides?: Partial<UserClientProfile>): UserClientProfile => ({
  _id: '',
  userId: '',
  clientId: '',
  name: '',
  phone: '',
  primaryAddress: undefined,
  savedAddresses: [],
  profileImage: DEFAULT_AVATAR,
  language: getStoredLanguage() ?? 'de',
  theme: getStoredTheme() ?? 'light',
  extra: {},
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

const normalizeProfile = (profile: Partial<UserClientProfile> | null | undefined): UserClientProfile =>
  createEmptyProfile({
    ...profile,
    savedAddresses: profile?.savedAddresses ?? [],
    extra: profile?.extra ?? {},
    profileImage: profile?.profileImage ?? DEFAULT_AVATAR,
  });

const getProfileStorageKey = (clientId?: string | null) => `hv-profile:${clientId || 'guest'}`;

export const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { auth, setAuth } = useAuth();
  const creatingProfileRef = useRef(false);
  const authRef = useRef(auth);

  const storageKey = useMemo(() => getProfileStorageKey(auth.clientId), [auth.clientId]);
  const [profile, setProfile] = useState<UserClientProfile>(createEmptyProfile());
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const profileRef = useRef(profile);

  useEffect(() => {
    authRef.current = auth;
  }, [auth]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const loadFromStorage = useCallback((): UserClientProfile | null => {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    try {
      return normalizeProfile(JSON.parse(raw) as UserClientProfile);
    } catch {
      return null;
    }
  }, [storageKey]);

  const saveToStorage = useCallback(
    (value: UserClientProfile | null) => {
      if (typeof window === 'undefined') return;

      if (!value) {
        localStorage.removeItem(storageKey);
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(value));
    },
    [storageKey]
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!isClientReady) return;

    const storedProfile = loadFromStorage();
    const nextProfile = storedProfile ?? createEmptyProfile();

    setProfile(nextProfile);
    saveToStorage(nextProfile);
    setLoading(false);
  }, [isClientReady, loadFromStorage, saveToStorage, storageKey]);

  useEffect(() => {
    if (!isClientReady) return;
    saveToStorage(profile);
  }, [isClientReady, profile, saveToStorage]);

  const applyProfile = useCallback(
    (nextProfile: Partial<UserClientProfile> | null | undefined) => {
      const normalized = normalizeProfile(nextProfile);
      setProfile(normalized);
      saveToStorage(normalized);
      return normalized;
    },
    [saveToStorage]
  );

  const clearIsNewUserFlag = useCallback(() => {
    const currentAuth = authRef.current;

    if (!currentAuth.isNewUser) return;

    setAuth({
      ...currentAuth,
      isNewUser: false,
    });
  }, [setAuth]);

  const ensureBackendProfile = useCallback(async () => {
    const currentProfile = profileRef.current;
    const initialProfile: CreateUserClientProfileInput = {
      name: currentProfile?.name?.trim() || undefined,
      phone: currentProfile?.phone?.trim() || undefined,
      profileImage: currentProfile?.profileImage || DEFAULT_AVATAR,
      language: currentProfile?.language ?? 'de',
      theme: currentProfile?.theme ?? 'light',
      savedAddresses: currentProfile?.savedAddresses ?? [],
      primaryAddress: currentProfile?.primaryAddress,
      extra: currentProfile?.extra ?? {},
    };

    const created = await createUserClientProfile(initialProfile);
    applyProfile(created.profile);
    clearIsNewUserFlag();
  }, [applyProfile, clearIsNewUserFlag]);

  const reloadProfile = useCallback(async () => {
    if (!auth.isLogged || auth.role === 'guest') return;

    try {
      const backendProfile = await getUserClientProfile();
      applyProfile(backendProfile);
      clearIsNewUserFlag();
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { code?: string } } };
      const status = err.response?.status;
      const code = err.response?.data?.code;
      const currentAuth = authRef.current;

      if (
        (status === 404 || code === 'USER_CLIENT_PROFILE_NOT_FOUND') &&
        currentAuth.isNewUser &&
        !creatingProfileRef.current
      ) {
        creatingProfileRef.current = true;

        try {
          await ensureBackendProfile();
        } finally {
          creatingProfileRef.current = false;
        }
        return;
      }

      if (status === 401 || status === 403) {
        try {
          await refreshToken();
          const backendProfile = await getUserClientProfile();
          applyProfile(backendProfile);
          clearIsNewUserFlag();
        } catch {
          return;
        }
      }
    }
  }, [applyProfile, auth.isLogged, auth.role, clearIsNewUserFlag, ensureBackendProfile]);

  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    void reloadProfile();
  }, [auth.isLogged, auth.role, auth.clientId, reloadProfile]);

  useEffect(() => {
    if (!isClientReady) return;
    if (auth.isLogged && auth.role !== 'guest') return;

    applyProfile(
      createEmptyProfile({
        profileImage: profile?.profileImage || DEFAULT_AVATAR,
        language: profile?.language ?? getStoredLanguage() ?? 'de',
        theme: profile?.theme ?? getStoredTheme() ?? 'light',
      })
    );
  }, [applyProfile, auth.isLogged, auth.role, isClientReady]);

  const updateProfile = useCallback(
    async (patch: UpdateUserClientProfileInput) => {
      const updatedLocal = normalizeProfile({
        ...profile,
        ...patch,
        savedAddresses: patch.savedAddresses ?? profile.savedAddresses,
        extra: patch.extra ?? profile.extra,
      });

      applyProfile(updatedLocal);

      if (!auth.isLogged || auth.role === 'guest') return;

      try {
        const response = await updateUserClientProfile(patch);
        applyProfile(response.profile);
      } catch (error) {
        const err = error as { response?: { status?: number } };

        if (err.response?.status === 404) {
          const created = await createUserClientProfile({
            name: updatedLocal.name || undefined,
            phone: updatedLocal.phone || undefined,
            primaryAddress: updatedLocal.primaryAddress,
            savedAddresses: updatedLocal.savedAddresses,
            profileImage: updatedLocal.profileImage,
            language: updatedLocal.language,
            theme: updatedLocal.theme,
            extra: updatedLocal.extra,
          });
          applyProfile(created.profile);
          return;
        }

        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            await refreshToken();
            const response = await updateUserClientProfile(patch);
            applyProfile(response.profile);
          } catch {
            return;
          }
        }
      }
    },
    [applyProfile, auth.isLogged, auth.role, profile]
  );

  const setLanguage = useCallback((language: AppLanguage) => updateProfile({ language }), [updateProfile]);
  const setTheme = useCallback((theme: ThemeMode) => updateProfile({ theme }), [updateProfile]);
  const setProfileImage = useCallback(
    (profileImage: string) => updateProfile({ profileImage }),
    [updateProfile]
  );

  if (!isClientReady || loading) return null;

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
