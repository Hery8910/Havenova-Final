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
  UserNotificationPreferences,
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

const DEFAULT_AVATAR = '/avatars/avatar-1.png';

const getDefaultNotificationPreferences = (): UserNotificationPreferences => ({
  inApp: {
    enabled: true,
    required: true,
  },
  email: {
    important: {
      enabled: true,
      required: true,
    },
    reminders: {
      enabled: false,
    },
    promotional: {
      enabled: false,
    },
  },
});

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
  notificationPreferences: getDefaultNotificationPreferences(),
  extra: {},
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

const normalizeNotificationPreferences = (
  notificationPreferences?: Partial<UserNotificationPreferences>
): UserNotificationPreferences => {
  const defaults = getDefaultNotificationPreferences();

  return {
    ...defaults,
    ...notificationPreferences,
    inApp: {
      ...defaults.inApp,
      ...notificationPreferences?.inApp,
    },
    email: {
      ...defaults.email,
      ...notificationPreferences?.email,
      important: {
        ...defaults.email.important,
        ...notificationPreferences?.email?.important,
      },
      reminders: {
        ...defaults.email.reminders,
        ...notificationPreferences?.email?.reminders,
      },
      promotional: {
        ...defaults.email.promotional,
        ...notificationPreferences?.email?.promotional,
      },
    },
  };
};

const mergeNotificationPreferences = (
  current: UserNotificationPreferences,
  patch?: UpdateUserClientProfileInput['notificationPreferences']
): UserNotificationPreferences =>
  normalizeNotificationPreferences({
    ...current,
    email: {
      ...current.email,
      ...patch?.email,
      reminders: {
        ...current.email.reminders,
        ...patch?.email?.reminders,
      },
      promotional: {
        ...current.email.promotional,
        ...patch?.email?.promotional,
      },
    },
  });

const normalizeProfile = (
  profile: Partial<UserClientProfile> | null | undefined,
  identity?: { userId?: string; clientId?: string }
): UserClientProfile =>
  createEmptyProfile({
    ...profile,
    userId: profile?.userId || identity?.userId || '',
    clientId: profile?.clientId || identity?.clientId || '',
    savedAddresses: profile?.savedAddresses ?? [],
    extra: profile?.extra ?? {},
    profileImage: profile?.profileImage ?? DEFAULT_AVATAR,
    notificationPreferences: normalizeNotificationPreferences(profile?.notificationPreferences),
  });

const getProfileStorageKey = (clientId?: string | null) => `hv-profile:${clientId || 'guest'}`;

export const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { auth, setAuth } = useAuth();
  const creatingProfileRef = useRef(false);
  const authRef = useRef(auth);
  const lastStorageKeyRef = useRef<string | null>(null);

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
      return normalizeProfile(JSON.parse(raw) as UserClientProfile, {
        userId: authRef.current.userId,
        clientId: authRef.current.clientId,
      });
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

    if (lastStorageKeyRef.current && lastStorageKeyRef.current !== storageKey) {
      localStorage.removeItem(lastStorageKeyRef.current);
    }

    const storedProfile = loadFromStorage();
    const nextProfile =
      storedProfile ??
      normalizeProfile(undefined, {
        userId: authRef.current.userId,
        clientId: authRef.current.clientId,
      });

    setProfile(nextProfile);
    saveToStorage(nextProfile);
    lastStorageKeyRef.current = storageKey;
    setLoading(false);
  }, [isClientReady, loadFromStorage, saveToStorage, storageKey]);

  useEffect(() => {
    if (!isClientReady) return;
    saveToStorage(profile);
  }, [isClientReady, profile, saveToStorage]);

  const applyProfile = useCallback(
    (nextProfile: Partial<UserClientProfile> | null | undefined) => {
      const normalized = normalizeProfile(nextProfile, {
        userId: authRef.current.userId,
        clientId: authRef.current.clientId,
      });
      setProfile(normalized);
      saveToStorage(normalized);
      return normalized;
    },
    [saveToStorage]
  );

  useEffect(() => {
    if (!isClientReady) return;
    if (!auth.userId && !auth.clientId) return;

    setProfile((current) => {
      const nextProfile = normalizeProfile(current, {
        userId: auth.userId,
        clientId: auth.clientId,
      });

      if (nextProfile.userId === current.userId && nextProfile.clientId === current.clientId) {
        return current;
      }

      saveToStorage(nextProfile);
      return nextProfile;
    });
  }, [auth.clientId, auth.userId, isClientReady, saveToStorage]);

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
      notificationPreferences: {
        email: {
          reminders: currentProfile?.notificationPreferences?.email?.reminders,
          promotional: currentProfile?.notificationPreferences?.email?.promotional,
        },
      },
      extra: currentProfile?.extra ?? {},
    };

    const created = await createUserClientProfile(initialProfile);
    applyProfile(created.profile);
    clearIsNewUserFlag();
  }, [applyProfile, clearIsNewUserFlag]);

  const handleProfileBootstrapError = useCallback((error: unknown) => {
    const err = error as {
      response?: { status?: number; data?: { code?: string; message?: string } };
      message?: string;
    };

    console.error('Profile bootstrap failed', {
      status: err.response?.status,
      code: err.response?.data?.code,
      message: err.response?.data?.message ?? err.message,
    });
  }, []);

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
        } catch (createError) {
          handleProfileBootstrapError(createError);
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
  }, [
    applyProfile,
    auth.isLogged,
    auth.role,
    clearIsNewUserFlag,
    ensureBackendProfile,
    handleProfileBootstrapError,
  ]);

  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    void reloadProfile();
  }, [auth.isLogged, auth.role, auth.clientId, reloadProfile]);

  useEffect(() => {
    if (!isClientReady) return;
    if (auth.isLogged && auth.role !== 'guest') return;

    applyProfile(
      normalizeProfile(
        {
          profileImage: profile?.profileImage || DEFAULT_AVATAR,
          language: profile?.language ?? getStoredLanguage() ?? 'de',
          theme: profile?.theme ?? getStoredTheme() ?? 'light',
        },
        {
          userId: auth.userId,
          clientId: auth.clientId,
        }
      )
    );
  }, [
    applyProfile,
    auth.clientId,
    auth.isLogged,
    auth.role,
    auth.userId,
    isClientReady,
    profile?.language,
    profile?.profileImage,
    profile?.theme,
  ]);

  const updateProfile = useCallback(
    async (patch: UpdateUserClientProfileInput) => {
      const updatedLocal = normalizeProfile(
        {
          ...profile,
          ...patch,
          savedAddresses: patch.savedAddresses ?? profile.savedAddresses,
          notificationPreferences: mergeNotificationPreferences(
            profile.notificationPreferences,
            patch.notificationPreferences
          ),
          extra: patch.extra ?? profile.extra,
        },
        {
          userId: auth.userId,
          clientId: auth.clientId,
        }
      );

      applyProfile(updatedLocal);

      if (!auth.isLogged || auth.role === 'guest') return;

      try {
        const response = await updateUserClientProfile(patch);
        applyProfile(response.profile);
      } catch (error) {
        const err = error as { response?: { status?: number } };

        if (err.response?.status === 404) {
          try {
            const created = await createUserClientProfile({
              name: updatedLocal.name || undefined,
              phone: updatedLocal.phone || undefined,
              primaryAddress: updatedLocal.primaryAddress,
              savedAddresses: updatedLocal.savedAddresses,
              profileImage: updatedLocal.profileImage,
              language: updatedLocal.language,
              theme: updatedLocal.theme,
              notificationPreferences: {
                email: {
                  reminders: updatedLocal.notificationPreferences.email.reminders,
                  promotional: updatedLocal.notificationPreferences.email.promotional,
                },
              },
              extra: updatedLocal.extra,
            });
            applyProfile(created.profile);
            clearIsNewUserFlag();
          } catch (createError) {
            handleProfileBootstrapError(createError);
          }
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
    [
      applyProfile,
      auth.isLogged,
      auth.role,
      clearIsNewUserFlag,
      handleProfileBootstrapError,
      profile,
    ]
  );

  const setLanguage = useCallback(
    (language: AppLanguage) => updateProfile({ language }),
    [updateProfile]
  );
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
