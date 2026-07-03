'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useGlobalAlert } from '../alert';
import { useI18n, getI18nFallbacks } from '../i18n';
import { useAuth } from '../auth/authContext';
import {
  SessionComplementSource,
  useSessionComplement,
} from '../sessionComplement/useSessionComplement';
import { getAdminProfile, updateAdminProfile } from '@havenova/services';
import { resolvePreferredContactEmail } from '@havenova/utils';
import {
  AdminRecord,
  UpdateAdminProfilePayload,
  ThemeMode,
} from '@/packages/types';

interface AdminContextProps {
  admin: AdminRecord;
  isOffline: boolean;
  lastSyncAt: string | null;
  loading: boolean;
  reloadAdmin: () => Promise<void>;
  source: SessionComplementSource;
  updateAdmin: (patch: UpdateAdminProfilePayload) => Promise<void>;
  setLanguage: (lang: 'de' | 'en' | 'es') => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const useOptionalAdminContext = () => useContext(AdminContext);

const DEFAULT_ADMIN_AVATAR = '/shared/avatars/avatar-1.png';
const getAdminStorageKey = (
  clientId?: string | null,
  userClientId?: string | null
) => `hv-admin:${clientId || 'guest'}:${userClientId || 'guest'}`;

const isSameAdminState = (left: AdminRecord | null, right: AdminRecord) => {
  if (!left) return false;

  return (
    left.userClientId === right.userClientId &&
    left.clientId === right.clientId &&
    left.email === right.email &&
    left.name === right.name &&
    left.phone === right.phone &&
    left.address === right.address &&
    left.profileImage === right.profileImage &&
    left.language === right.language &&
    left.theme === right.theme &&
    JSON.stringify(left.extra ?? null) === JSON.stringify(right.extra ?? null) &&
    left.createdAt === right.createdAt &&
    left.updatedAt === right.updatedAt
  );
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { auth, refreshAuth } = useAuth();
  const { showError, closeAlert } = useGlobalAlert();
  const { texts, language } = useI18n();
  const { fallbackPopups } = getI18nFallbacks(language);
  const popups = useMemo(() => texts?.popups ?? {}, [texts]);
  const clientId = auth.clientId;
  const storageKey = useMemo(
    () => getAdminStorageKey(auth.clientId, auth.userClientId),
    [auth.clientId, auth.userClientId]
  );
  const globalInternalErrorFallback = fallbackPopups.GLOBAL_INTERNAL_ERROR;
  const createLocalDefault = useMemo(
    () =>
      (previous?: AdminRecord | null): AdminRecord => ({
        userClientId: previous?.userClientId ?? auth.userClientId ?? '',
        clientId: previous?.clientId ?? clientId ?? '',
        email: resolvePreferredContactEmail(previous?.email, auth.email),
        name: previous?.name ?? '',
        phone: previous?.phone,
        address: previous?.address,
        profileImage: previous?.profileImage ?? DEFAULT_ADMIN_AVATAR,
        language: previous?.language ?? 'de',
        theme: previous?.theme ?? 'light',
        extra: previous?.extra,
        roles: previous?.roles,
        jobTitle: previous?.jobTitle,
        status: previous?.status,
        isVerified: previous?.isVerified,
        authCreated: previous?.authCreated,
        userClientCreated: previous?.userClientCreated,
        adminCreated: previous?.adminCreated,
        adminUpdated: previous?.adminUpdated,
        inviteSent: previous?.inviteSent,
        createdAt: previous?.createdAt,
        updatedAt: previous?.updatedAt,
      }),
    [auth.email, auth.userClientId, clientId]
  );

  const getStoredTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  };

  const getStoredLanguage = (): 'de' | 'en' | 'es' | null => {
    if (typeof window === 'undefined') return null;
    const stored = Cookies.get('lang');
    return stored === 'de' || stored === 'en' || stored === 'es' ? stored : null;
  };
  const alertApi = useMemo(
    () => ({
      showError,
      closeAlert,
    }),
    [showError, closeAlert]
  );

  const createLoggedOutLocal = useCallback(
    (previous?: AdminRecord | null): AdminRecord => ({
      ...createLocalDefault(null),
      userClientId: '',
      email: '',
      name: '',
      phone: '',
      address: '',
      language: previous?.language ?? getStoredLanguage() ?? 'de',
      theme: previous?.theme ?? getStoredTheme() ?? 'light',
    }),
    [createLocalDefault]
  );

  const updateRemote = useCallback(async (patch: Partial<UpdateAdminProfilePayload>) => {
    await updateAdminProfile(patch);
  }, []);

  const isNotFoundError = useCallback(
    (status?: number, code?: string) => status === 404 || code === 'ADMIN_NOT_FOUND',
    []
  );

  const {
    entity: admin,
    isOffline,
    lastSyncAt,
    loading,
    reloadEntity: reloadAdmin,
    setLanguage,
    setProfileImage,
    setTheme,
    source,
    updateEntity: updateAdmin,
  } = useSessionComplement<AdminRecord, UpdateAdminProfilePayload>({
    auth,
    refreshAuth,
    storageKey,
    createLocalDefault,
    createLoggedOutLocal,
    isSameState: isSameAdminState,
    fetchRemote: getAdminProfile,
    updateRemote,
    isNotFoundError,
    missingEntityPopupKey: 'ADMIN_NOT_FOUND',
    missingEntityFallback: globalInternalErrorFallback,
    popups,
    alert: alertApi,
  });

  if (loading || !admin) return null;

  return (
    <AdminContext.Provider
      value={{
        admin,
        isOffline,
        lastSyncAt,
        loading,
        reloadAdmin,
        source,
        updateAdmin,
        setLanguage: (lang) => setLanguage(lang),
        setTheme: (theme) => setTheme(theme),
        setProfileImage: (profileImage) => setProfileImage(profileImage),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
