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
import { useAuth } from '../auth/authContext';
import type {
  AppLanguage,
  CreateUserClientProfileInput,
  ThemeMode,
  UpdateUserClientProfileInput,
  UserClientProfile,
  UserNotificationPreferences,
} from '@/packages/types';
import {
  createUserClientProfile,
  getCsrfDebugState,
  getUserClientProfile,
  updateUserClientProfile,
} from '@havenova/services';
import { resolvePreferredContactEmail } from '@havenova/utils';

interface ProfileContextProps {
  profile: UserClientProfile;
  loading: boolean;
  source: 'server' | 'storage' | 'default' | 'dev-fallback';
  isOffline: boolean;
  lastSyncAt: string | null;
  reloadProfile: () => Promise<void>;
  updateProfile: (patch: UpdateUserClientProfileInput) => Promise<void>;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

const DEFAULT_AVATAR = '/shared/avatars/avatar-1.png';

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
  return stored === 'de' || stored === 'en' || stored === 'es' ? stored : null;
};

const createEmptyProfile = (overrides?: Partial<UserClientProfile>): UserClientProfile => ({
  _id: '',
  userClientId: '',
  clientId: '',
  contactEmail: '',
  name: '',
  phone: '',
  primaryAddress: undefined,
  savedAddresses: [],
  profileImage: DEFAULT_AVATAR,
  language: 'de',
  theme: 'light',
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
  identity?: { userClientId?: string; clientId?: string }
): UserClientProfile =>
  createEmptyProfile({
    ...profile,
    userClientId: profile?.userClientId || identity?.userClientId || '',
    clientId: profile?.clientId || identity?.clientId || '',
    contactEmail: profile?.contactEmail ?? '',
    savedAddresses: profile?.savedAddresses ?? [],
    extra: profile?.extra ?? {},
    profileImage: profile?.profileImage ?? DEFAULT_AVATAR,
    notificationPreferences: normalizeNotificationPreferences(profile?.notificationPreferences),
  });

const getProfileStorageKey = (
  clientId?: string | null,
  userClientId?: string | null
) => `hv-profile:${clientId || 'guest'}:${userClientId || 'guest'}`;

const isOfflineProfileError = (error: unknown): boolean => {
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

const isDevFallbackProfile = (value?: Partial<UserClientProfile> | null) => value?._id === 'dev-profile';

const isProfileDebugEnabled = (): boolean => process.env.NODE_ENV !== 'production';

const getReadableCookieDiagnostics = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
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

const debugProfileTrace = (label: string, payload?: Record<string, unknown>) => {
  if (!isProfileDebugEnabled() || typeof window === 'undefined') return;
  console.debug(`[profile-debug] ${label}`, payload ?? {});
};

export const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const useOptionalProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { auth, loading: authLoading, refreshAuth, setAuth } = useAuth();
  const creatingProfileRef = useRef(false);
  const authRef = useRef(auth);
  const isDevProfileFallbackEnabled = process.env.NODE_ENV !== 'production';

  const storageKey = useMemo(
    () => getProfileStorageKey(auth.clientId, auth.userClientId),
    [auth.clientId, auth.userClientId]
  );
  const [profile, setProfile] = useState<UserClientProfile>(createEmptyProfile());
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [source, setSource] = useState<'server' | 'storage' | 'default' | 'dev-fallback'>(
    'default'
  );
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
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
        userClientId: authRef.current.userClientId,
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

    const storedProfile = loadFromStorage();
    const nextProfile =
      storedProfile ??
      normalizeProfile(undefined, {
        userClientId: authRef.current.userClientId,
        clientId: authRef.current.clientId,
      });

    setProfile(nextProfile);
    saveToStorage(nextProfile);
    setSource(storedProfile ? (isDevFallbackProfile(storedProfile) ? 'dev-fallback' : 'storage') : 'default');
    setIsOffline(Boolean(storedProfile && isDevFallbackProfile(storedProfile)));
    setLoading(false);
  }, [isClientReady, loadFromStorage, saveToStorage, storageKey]);

  useEffect(() => {
    if (!isClientReady) return;
    saveToStorage(profile);
  }, [isClientReady, profile, saveToStorage]);

  useEffect(() => {
    if (!isClientReady) return;
    if (!profile?.theme) return;

    document.documentElement.setAttribute('data-theme', profile.theme);
    localStorage.setItem('theme', profile.theme);
  }, [isClientReady, profile?.theme]);

  const applyProfile = useCallback(
    (
      nextProfile: Partial<UserClientProfile> | null | undefined,
      options?: {
        source?: 'server' | 'storage' | 'default' | 'dev-fallback';
        isOffline?: boolean;
        syncedAt?: string | null;
      }
    ) => {
      const normalized = normalizeProfile(nextProfile, {
        userClientId: authRef.current.userClientId,
        clientId: authRef.current.clientId,
      });
      setProfile(normalized);
      saveToStorage(normalized);
      if (options?.source) {
        setSource(options.source);
      } else if (isDevFallbackProfile(normalized)) {
        setSource('dev-fallback');
      }
      if (typeof options?.isOffline === 'boolean') {
        setIsOffline(options.isOffline);
      } else if (isDevFallbackProfile(normalized)) {
        setIsOffline(true);
      }
      if (options?.syncedAt !== undefined) {
        setLastSyncAt(options.syncedAt);
      }
      return normalized;
    },
    [saveToStorage]
  );

  useEffect(() => {
    if (!isClientReady) return;
    if (!auth.userClientId && !auth.clientId) return;

    setProfile((current) => {
      const nextProfile = normalizeProfile(current, {
        userClientId: auth.userClientId,
        clientId: auth.clientId,
      });

      if (
        nextProfile.userClientId === current.userClientId &&
        nextProfile.clientId === current.clientId
      ) {
        return current;
      }

      saveToStorage(nextProfile);
      return nextProfile;
    });
  }, [auth.clientId, auth.userClientId, isClientReady, saveToStorage]);

  const clearIsNewUserFlag = useCallback(() => {
    const currentAuth = authRef.current;

    if (!currentAuth.isNewUser) return;

    setAuth({
      ...currentAuth,
      isNewUser: false,
    });
  }, [setAuth]);

  const createDevProfileFallback = useCallback((): UserClientProfile => {
    const currentProfile = profileRef.current;
    return normalizeProfile(
      {
        ...currentProfile,
        _id: currentProfile?._id || 'dev-profile',
        contactEmail:
          resolvePreferredContactEmail(currentProfile?.contactEmail, authRef.current.email) ||
          'dev.user@havenova.local',
        name: currentProfile?.name || 'Development User',
        phone: currentProfile?.phone || '',
        profileImage: currentProfile?.profileImage || DEFAULT_AVATAR,
        language: currentProfile?.language ?? getStoredLanguage() ?? 'de',
        theme: currentProfile?.theme ?? getStoredTheme() ?? 'light',
      },
      {
        userClientId: authRef.current.userClientId,
        clientId: authRef.current.clientId,
      }
    );
  }, []);

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
    applyProfile(created.profile, {
      source: 'server',
      isOffline: false,
      syncedAt: new Date().toISOString(),
    });
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
      authUserClientId: authRef.current.userClientId,
      clientId: authRef.current.clientId,
      ...getReadableCookieDiagnostics(),
    });
  }, []);

  const reloadProfile = useCallback(async () => {
    if (!auth.isLogged || auth.role === 'guest') return;

    try {
      const backendProfile = await getUserClientProfile();
      applyProfile(backendProfile, {
        source: 'server',
        isOffline: false,
        syncedAt: new Date().toISOString(),
      });
      clearIsNewUserFlag();
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { code?: string } } };
      const status = err.response?.status;
      const code = err.response?.data?.code;

      if (
        (status === 404 || code === 'USER_CLIENT_PROFILE_NOT_FOUND') &&
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
        debugProfileTrace('reloadProfile.protected-fetch-failed', {
          status,
          code,
          authUserClientId: auth.userClientId,
          clientId: auth.clientId,
          ...getReadableCookieDiagnostics(),
        });
        try {
          debugProfileTrace('reloadProfile.try-refresh-token', {
            authUserClientId: auth.userClientId,
            clientId: auth.clientId,
            ...getReadableCookieDiagnostics(),
          });
          const refreshResult = await refreshAuth();
          if (!refreshResult.syncedFromServer) {
            return;
          }
          const backendProfile = await getUserClientProfile();
          applyProfile(backendProfile, {
            source: 'server',
            isOffline: false,
            syncedAt: new Date().toISOString(),
          });
          clearIsNewUserFlag();
        } catch (refreshError) {
          const refreshErr = refreshError as {
            response?: { status?: number; data?: { code?: string; message?: string } };
            message?: string;
          };
          console.error('Profile refresh token recovery failed', {
            status: refreshErr.response?.status,
            code: refreshErr.response?.data?.code,
            message: refreshErr.response?.data?.message ?? refreshErr.message,
            authUserClientId: auth.userClientId,
            clientId: auth.clientId,
            ...getReadableCookieDiagnostics(),
          });
          if (isOfflineProfileError(refreshError)) {
            if (isDevProfileFallbackEnabled && !profileRef.current.contactEmail) {
              applyProfile(createDevProfileFallback(), {
                source: 'dev-fallback',
                isOffline: true,
              });
            } else {
              setSource('storage');
              setIsOffline(true);
            }
          }
          return;
        }
      } else if (isOfflineProfileError(error)) {
        if (isDevProfileFallbackEnabled && !profileRef.current.contactEmail) {
          applyProfile(createDevProfileFallback(), {
            source: 'dev-fallback',
            isOffline: true,
          });
        } else {
          setSource('storage');
          setIsOffline(true);
        }
      }
    }
  }, [
    applyProfile,
    auth.isLogged,
    auth.role,
    clearIsNewUserFlag,
    createDevProfileFallback,
    ensureBackendProfile,
    handleProfileBootstrapError,
    isDevProfileFallbackEnabled,
    refreshAuth,
  ]);

  useEffect(() => {
    if (authLoading) return;
    if (!auth.isLogged || auth.role === 'guest') return;
    void reloadProfile();
  }, [auth.clientId, auth.isLogged, auth.role, authLoading, reloadProfile]);

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
          userClientId: auth.userClientId,
          clientId: auth.clientId,
        }
      ),
      {
        source: 'default',
        isOffline: false,
      }
    );
  }, [
    applyProfile,
    auth.clientId,
    auth.isLogged,
    auth.role,
    auth.userClientId,
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
          userClientId: auth.userClientId,
          clientId: auth.clientId,
        }
      );

      applyProfile(updatedLocal, {
        source: 'storage',
      });

      if (!auth.isLogged || auth.role === 'guest') return;

      try {
        const response = await updateUserClientProfile(patch);
        applyProfile(response.profile, {
          source: 'server',
          isOffline: false,
          syncedAt: new Date().toISOString(),
        });
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
            applyProfile(created.profile, {
              source: 'server',
              isOffline: false,
              syncedAt: new Date().toISOString(),
            });
            clearIsNewUserFlag();
          } catch (createError) {
            handleProfileBootstrapError(createError);
          }
          return;
        }

        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            const refreshResult = await refreshAuth();
            if (!refreshResult.syncedFromServer) {
              return;
            }
            const response = await updateUserClientProfile(patch);
            applyProfile(response.profile, {
              source: 'server',
              isOffline: false,
              syncedAt: new Date().toISOString(),
            });
          } catch (refreshError) {
            if (isOfflineProfileError(refreshError)) {
              if (isDevProfileFallbackEnabled && !profileRef.current.contactEmail) {
                applyProfile(createDevProfileFallback(), {
                  source: 'dev-fallback',
                  isOffline: true,
                });
              } else {
                setSource('storage');
                setIsOffline(true);
              }
            }
            return;
          }
        } else if (isOfflineProfileError(error)) {
          if (isDevProfileFallbackEnabled && !profileRef.current.contactEmail) {
            applyProfile(createDevProfileFallback(), {
              source: 'dev-fallback',
              isOffline: true,
            });
          } else {
            setSource('storage');
            setIsOffline(true);
          }
        }
      }
    },
    [
      applyProfile,
      auth.clientId,
      auth.isLogged,
      auth.role,
      auth.userClientId,
      clearIsNewUserFlag,
      createDevProfileFallback,
      handleProfileBootstrapError,
      isDevProfileFallbackEnabled,
      profile,
      refreshAuth,
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

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        source,
        isOffline,
        lastSyncAt,
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
