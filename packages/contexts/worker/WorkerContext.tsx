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
import { getWorkerProfile, updateWorkerProfile } from '@havenova/services';
import { resolvePreferredContactEmail } from '@havenova/utils';
import {
  UpdateWorkerProfilePayload,
  WorkerLanguage,
  WorkerRecord,
  ThemeMode,
} from '@/packages/types';

interface WorkerContextProps {
  worker: WorkerRecord;
  isOffline: boolean;
  lastSyncAt: string | null;
  loading: boolean;
  reloadWorker: () => Promise<void>;
  source: SessionComplementSource;
  updateWorker: (patch: UpdateWorkerProfilePayload) => Promise<void>;
  setLanguage: (lang: WorkerLanguage) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

export const WorkerContext = createContext<WorkerContextProps | undefined>(undefined);

export const useOptionalWorkerContext = () => useContext(WorkerContext);

const DEFAULT_WORKER_AVATAR = '/shared/avatars/avatar-1.png';
const getWorkerStorageKey = (
  clientId?: string | null,
  userClientId?: string | null
) => `hv-worker:${clientId || 'guest'}:${userClientId || 'guest'}`;

const isSameWorkerState = (left: WorkerRecord | null, right: WorkerRecord) => {
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

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
  const { auth, refreshAuth } = useAuth();
  const { showError, closeAlert } = useGlobalAlert();
  const { texts, language } = useI18n();
  const { fallbackPopups } = getI18nFallbacks(language);
  const popups = useMemo(() => texts?.popups ?? {}, [texts]);
  const clientId = auth.clientId;
  const storageKey = useMemo(
    () => getWorkerStorageKey(auth.clientId, auth.userClientId),
    [auth.clientId, auth.userClientId]
  );
  const workerLoadFailedFallback =
    fallbackPopups.WORKER_LOAD_FAILED ?? fallbackPopups.GLOBAL_INTERNAL_ERROR;

  const getStoredTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  };

  const getStoredLanguage = (): WorkerLanguage | null => {
    if (typeof window === 'undefined') return null;
    const stored = Cookies.get('lang');
    return stored === 'de' || stored === 'en' || stored === 'es' ? stored : null;
  };

  const createLocalDefault = useMemo(
    () =>
      (previous?: WorkerRecord | null): WorkerRecord => ({
        userClientId: previous?.userClientId ?? auth.userClientId ?? '',
        clientId: previous?.clientId ?? clientId ?? '',
        // Session email is only a continuity fallback until the worker complement
        // loads or persists its own visible email.
        email: resolvePreferredContactEmail(previous?.email, auth.email),
        name: previous?.name ?? '',
        phone: previous?.phone,
        address: previous?.address,
        profileImage: previous?.profileImage ?? DEFAULT_WORKER_AVATAR,
        language: previous?.language ?? getStoredLanguage() ?? 'de',
        theme: previous?.theme ?? getStoredTheme() ?? 'light',
        extra: previous?.extra,
        roles: previous?.roles,
        jobTitle: previous?.jobTitle,
        status: previous?.status,
        isVerified: previous?.isVerified,
        authCreated: previous?.authCreated,
        userClientCreated: previous?.userClientCreated,
        createdAt: previous?.createdAt,
        updatedAt: previous?.updatedAt,
      }),
    [auth.email, auth.userClientId, clientId]
  );
  const alertApi = useMemo(
    () => ({
      showError,
      closeAlert,
    }),
    [showError, closeAlert]
  );

  const createLoggedOutLocal = useCallback(
    (previous?: WorkerRecord | null): WorkerRecord => ({
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

  const updateRemote = useCallback(async (patch: Partial<UpdateWorkerProfilePayload>) => {
    await updateWorkerProfile(patch);
  }, []);

  const isNotFoundError = useCallback(
    (status?: number, code?: string) => status === 404 || code === 'WORKER_NOT_FOUND',
    []
  );

  const {
    entity: worker,
    isOffline,
    lastSyncAt,
    loading,
    reloadEntity: reloadWorker,
    setLanguage,
    setProfileImage,
    setTheme,
    source,
    updateEntity: updateWorker,
  } = useSessionComplement<WorkerRecord, UpdateWorkerProfilePayload>({
    auth,
    refreshAuth,
    storageKey,
    createLocalDefault,
    createLoggedOutLocal,
    isSameState: isSameWorkerState,
    fetchRemote: getWorkerProfile,
    updateRemote,
    isNotFoundError,
    missingEntityPopupKey: 'WORKER_LOAD_FAILED',
    missingEntityFallback: workerLoadFailedFallback,
    popups,
    alert: alertApi,
  });

  const resolvedWorker = worker ?? createLocalDefault(null);

  return (
    <WorkerContext.Provider
      value={{
        worker: resolvedWorker,
        isOffline,
        lastSyncAt,
        loading,
        reloadWorker,
        source,
        updateWorker,
        setLanguage: (lang) => setLanguage(lang),
        setTheme: (theme) => setTheme(theme),
        setProfileImage: (profileImage) => setProfileImage(profileImage),
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorker = () => {
  const ctx = useContext(WorkerContext);
  if (!ctx) throw new Error('useWorker must be used within WorkerProvider');
  return ctx;
};
