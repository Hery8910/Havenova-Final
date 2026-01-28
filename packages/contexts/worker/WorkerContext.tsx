'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { useGlobalAlert } from '../alert';
import { useI18n, fallbackPopups } from '../i18n';
import { useAuth } from '../auth/authContext';
import { getWorkerProfile, refreshToken, updateWorkerProfile } from '@havenova/services';
import { getPopup } from '@havenova/utils';
import {
  UpdateWorkerProfilePayload,
  WorkerLanguage,
  WorkerRecord,
} from '@/packages/types/worker/workerTypes';
import { ThemeMode } from '@/packages/types/profile/profileTypes';

const WORKER_STORAGE_KEY = 'hv-worker-profile';

interface WorkerContextProps {
  worker: WorkerRecord;
  loading: boolean;
  reloadWorker: () => Promise<void>;
  updateWorker: (patch: UpdateWorkerProfilePayload) => Promise<void>;
  setLanguage: (lang: WorkerLanguage) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
}

export const WorkerContext = createContext<WorkerContextProps | undefined>(undefined);

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
  const { auth } = useAuth();
  const { showError, closeAlert } = useGlobalAlert();
  const { texts } = useI18n();
  const popups = texts?.popups ?? {};
  const clientId = auth.clientId;
  const [worker, setWorker] = useState<WorkerRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const isRefreshingRef = useRef(false);
  const notFoundRef = useRef(false);
  const didNotifyRef = useRef(false);
  const workerRef = useRef<WorkerRecord | null>(null);

  const loadFromStorage = (): WorkerRecord | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(WORKER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as WorkerRecord;
    } catch {
      return null;
    }
  };

  const saveToStorage = (value: WorkerRecord | null) => {
    if (typeof window === 'undefined') return;
    if (!value) {
      localStorage.removeItem(WORKER_STORAGE_KEY);
      return;
    }
    localStorage.setItem(WORKER_STORAGE_KEY, JSON.stringify(value));
  };

  const createLocalDefault = (previous?: WorkerRecord | null): WorkerRecord => ({
    userId: previous?.userId ?? '',
    clientId: previous?.clientId ?? clientId ?? '',
    email: previous?.email ?? auth.email ?? '',
    name: previous?.name ?? '',
    phone: previous?.phone,
    address: previous?.address,
    profileImage: previous?.profileImage ?? '/avatars/avatar-1.svg',
    language: previous?.language ?? 'de',
    theme: previous?.theme ?? 'light',
    extra: previous?.extra,
    createdAt: previous?.createdAt,
    updatedAt: previous?.updatedAt,
  });

  const getStoredTheme = (): ThemeMode | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  };

  const getStoredLanguage = (): WorkerLanguage | null => {
    if (typeof window === 'undefined') return null;
    const stored = Cookies.get('lang');
    return stored === 'de' || stored === 'en' ? stored : null;
  };

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!isClientReady) return;

    const stored = loadFromStorage();
    if (stored) {
      setWorker(stored);
    } else {
      const local = createLocalDefault(null);
      setWorker(local);
      saveToStorage(local);
    }
    setLoading(false);
  }, [isClientReady]);

  useEffect(() => {
    if (!isClientReady || !worker) return;
    saveToStorage(worker);
  }, [worker, isClientReady]);

  useEffect(() => {
    workerRef.current = worker;
  }, [worker]);

  const reloadWorker = useCallback(async () => {
    if (!auth.isLogged || auth.role === 'guest' || isRefreshingRef.current) return;
    if (notFoundRef.current) return;
    isRefreshingRef.current = true;

    try {
      const backendWorker = await getWorkerProfile();
      const merged = { ...createLocalDefault(workerRef.current), ...backendWorker };
      setWorker(merged);
      saveToStorage(merged);
      notFoundRef.current = false;
      didNotifyRef.current = false;
    } catch (err: any) {
      const status = err?.response?.status;
      const code = err?.response?.data?.code;

      if (status === 404 || code === 'WORKER_NOT_FOUND') {
        notFoundRef.current = true;
        const local = createLocalDefault(workerRef.current);
        setWorker(local);
        saveToStorage(local);
        if (!didNotifyRef.current) {
          didNotifyRef.current = true;
          const popup = getPopup(
            popups,
            'WORKER_LOAD_FAILED',
            'GLOBAL_INTERNAL_ERROR',
            fallbackPopups.WORKER_LOAD_FAILED ?? fallbackPopups.GLOBAL_INTERNAL_ERROR
          );
          showError({
            response: {
              status: 404,
              title: popup.title,
              description: popup.description,
              cancelLabel: popup.close ?? fallbackPopups.GLOBAL_INTERNAL_ERROR.close,
            },
            onCancel: closeAlert,
          });
        }
        return;
      }

      if (status === 401 || status === 403) {
        try {
          await refreshToken();
          const backendWorker = await getWorkerProfile();
          const merged = { ...createLocalDefault(workerRef.current), ...backendWorker };
          setWorker(merged);
          saveToStorage(merged);
          notFoundRef.current = false;
        } catch {
          // AuthContext should handle the session fallback.
        }
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [auth.isLogged, auth.role, clientId]);

  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    reloadWorker();
  }, [auth.isLogged, auth.role, reloadWorker]);

  useEffect(() => {
    if (!isClientReady) return;
    if (auth.isLogged && auth.role !== 'guest') return;
    notFoundRef.current = false;
    didNotifyRef.current = false;
    const lastWorker = worker ?? loadFromStorage();
    const local = {
      ...createLocalDefault(null),
      userId: '',
      email: '',
      name: '',
      phone: '',
      address: '',
      language: lastWorker?.language ?? getStoredLanguage() ?? 'de',
      theme: lastWorker?.theme ?? getStoredTheme() ?? 'light',
    };
    setWorker(local);
    saveToStorage(local);
  }, [auth.isLogged, auth.role, isClientReady]);

  const updateWorker = useCallback(
    async (patch: UpdateWorkerProfilePayload) => {
      if (!worker) return;

      const updatedLocal = { ...worker, ...patch };
      setWorker(updatedLocal);
      saveToStorage(updatedLocal);

      if (auth.isLogged && auth.role !== 'guest') {
        try {
          await updateWorkerProfile(patch);
          await reloadWorker();
        } catch (err: any) {
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            try {
              await refreshToken();
              await updateWorkerProfile(patch);
              await reloadWorker();
            } catch {
              // AuthContext should handle the session fallback.
            }
          }
        }
      }
    },
    [auth.isLogged, auth.role, worker, reloadWorker]
  );

  const setLanguage = (lang: WorkerLanguage) => updateWorker({ language: lang });
  const setTheme = (theme: ThemeMode) => updateWorker({ theme });
  const setProfileImage = (profileImage: string) => updateWorker({ profileImage });

  if (!isClientReady || loading || !worker) return null;

  return (
    <WorkerContext.Provider
      value={{
        worker,
        loading,
        reloadWorker,
        updateWorker,
        setLanguage,
        setTheme,
        setProfileImage,
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
