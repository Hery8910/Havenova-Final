'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  normalizeTheme,
  readSessionStorageValue,
  removeSessionStorageValue,
  synchronizeDocumentTheme,
  writeSessionStorageValue,
} from './themeEffects';
import type { PopupsTexts } from '../alert/alert.types';

export type SessionComplementSource = 'server' | 'storage' | 'default' | 'dev-fallback';

type SessionAuthLike = {
  clientId?: string | null;
  email?: string | null;
  isLogged: boolean;
  role: string;
  userClientId?: string | null;
};

type RefreshAuthLike = () => Promise<{ syncedFromServer: boolean }>;

type PopupDescriptor = {
  close?: string;
  description: string;
  title: string;
};

type AlertApi = {
  closeAlert: () => void;
  showError: (options: {
    onCancel?: () => void;
    response: {
      cancelLabel?: string;
      description: string;
      status: number;
      title: string;
    };
  }) => void;
};

type SessionComplementEntity = {
  language?: string;
  profileImage?: string;
  theme?: string;
};

type UseSessionComplementOptions<T extends SessionComplementEntity, TPatch extends object> = {
  alert: AlertApi;
  auth: SessionAuthLike;
  createLocalDefault: (previous?: T | null) => T;
  createLoggedOutLocal: (previous?: T | null) => T;
  fetchRemote: () => Promise<T>;
  isNotFoundError: (status?: number, code?: string) => boolean;
  isSameState: (left: T | null, right: T) => boolean;
  missingEntityFallback: PopupDescriptor;
  missingEntityPopupKey: string;
  popups: PopupsTexts;
  refreshAuth: RefreshAuthLike;
  storageKey: string;
  updateRemote: (patch: Partial<TPatch>) => Promise<T | void>;
};

type ApplyEntityOptions = {
  isOffline?: boolean;
  source?: SessionComplementSource;
  syncedAt?: string | null;
};

export type SessionComplementState<T, TPatch> = {
  entity: T | null;
  isOffline: boolean;
  lastSyncAt: string | null;
  loading: boolean;
  reloadEntity: () => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  setProfileImage: (profileImage: string) => Promise<void>;
  setTheme: (theme: string) => Promise<void>;
  source: SessionComplementSource;
  updateEntity: (patch: Partial<TPatch>) => Promise<void>;
};

export const isOfflineSessionComplementError = (error: unknown): boolean => {
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

const getPopup = (popups: PopupsTexts, key: string, fallback: PopupDescriptor): PopupDescriptor => {
  const candidate = popups[key as keyof PopupsTexts];
  if (
    candidate &&
    typeof candidate === 'object' &&
    'title' in candidate &&
    'description' in candidate
  ) {
    return candidate;
  }
  return fallback;
};

export const useSessionComplement = <T extends SessionComplementEntity, TPatch extends object>({
  alert,
  auth,
  createLocalDefault,
  createLoggedOutLocal,
  fetchRemote,
  isNotFoundError,
  isSameState,
  missingEntityFallback,
  missingEntityPopupKey,
  popups,
  refreshAuth,
  storageKey,
  updateRemote,
}: UseSessionComplementOptions<T, TPatch>): SessionComplementState<T, TPatch> => {
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [source, setSource] = useState<SessionComplementSource>('default');
  const [isOffline, setIsOffline] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);
  const notFoundRef = useRef(false);
  const didNotifyRef = useRef(false);
  const entityRef = useRef<T | null>(null);
  const autoReloadKeyRef = useRef<string | null>(null);

  const loadFromStorage = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;

    const raw = readSessionStorageValue(storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [storageKey]);

  const saveToStorage = useCallback(
    (value: T | null) => {
      if (typeof window === 'undefined') return;

      if (!value) {
        removeSessionStorageValue(storageKey);
        return;
      }

      writeSessionStorageValue(storageKey, JSON.stringify(value));
    },
    [storageKey]
  );

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!isClientReady) return;

    const stored = loadFromStorage();
    const nextEntity = stored ?? createLocalDefault(null);
    setEntity(nextEntity);
    entityRef.current = nextEntity;
    saveToStorage(nextEntity);
    setSource(stored ? 'storage' : 'default');
    setIsOffline(false);
    setLastSyncAt(null);
    setLoading(false);
  }, [createLocalDefault, isClientReady, loadFromStorage, saveToStorage]);

  useEffect(() => {
    if (!isClientReady || !entity) return;
    saveToStorage(entity);
  }, [entity, isClientReady, saveToStorage]);

  useEffect(() => {
    entityRef.current = entity;
  }, [entity]);

  useEffect(() => {
    if (!isClientReady) return;
    const theme = normalizeTheme(entity?.theme);
    if (!theme) return;

    synchronizeDocumentTheme(theme);
  }, [entity?.theme, isClientReady]);

  const applyEntity = useCallback(
    (nextEntity: T, options?: ApplyEntityOptions) => {
      setEntity(nextEntity);
      entityRef.current = nextEntity;
      saveToStorage(nextEntity);
      if (options?.source) {
        setSource(options.source);
      }
      if (typeof options?.isOffline === 'boolean') {
        setIsOffline(options.isOffline);
      }
      if (options?.syncedAt !== undefined) {
        setLastSyncAt(options.syncedAt);
      }
      notFoundRef.current = false;
      didNotifyRef.current = false;
    },
    [saveToStorage]
  );

  const notifyMissingEntity = useCallback(() => {
    if (didNotifyRef.current) return;
    didNotifyRef.current = true;

    const popup = getPopup(popups, missingEntityPopupKey, missingEntityFallback);

    alert.showError({
      response: {
        status: 404,
        title: popup.title,
        description: popup.description,
        cancelLabel: popup.close ?? missingEntityFallback.close,
      },
      onCancel: alert.closeAlert,
    });
  }, [alert, missingEntityFallback, missingEntityPopupKey, popups]);

  const setOfflineStorageState = useCallback(() => {
    setSource('storage');
    setIsOffline(true);
  }, []);

  const reloadEntity = useCallback(async () => {
    if (!auth.isLogged || auth.role === 'guest' || isRefreshingRef.current) return;
    if (notFoundRef.current) return;

    isRefreshingRef.current = true;

    try {
      const remoteEntity = await fetchRemote();
      applyEntity(remoteEntity, {
        source: 'server',
        isOffline: false,
        syncedAt: new Date().toISOString(),
      });
    } catch (error) {
      const err = error as { response?: { status?: number; data?: { code?: string } } };
      const status = err?.response?.status;
      const code = err?.response?.data?.code;

      if (isNotFoundError(status, code)) {
        notFoundRef.current = true;
        const local = createLocalDefault(entityRef.current);
        setEntity((current) => {
          if (isSameState(current, local)) {
            return current;
          }

          entityRef.current = local;
          saveToStorage(local);
          return local;
        });
        setSource('default');
        setIsOffline(false);
        setLastSyncAt(null);
        notifyMissingEntity();
        return;
      }

      if (status === 401 || status === 403) {
        try {
          const refreshResult = await refreshAuth();
          if (!refreshResult.syncedFromServer) {
            return;
          }

          const remoteEntity = await fetchRemote();
          applyEntity(remoteEntity, {
            source: 'server',
            isOffline: false,
            syncedAt: new Date().toISOString(),
          });
          return;
        } catch (refreshError) {
          if (isOfflineSessionComplementError(refreshError)) {
            setOfflineStorageState();
          }
          return;
        }
      }

      if (isOfflineSessionComplementError(error)) {
        setOfflineStorageState();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [
    applyEntity,
    auth.isLogged,
    auth.role,
    createLocalDefault,
    fetchRemote,
    isNotFoundError,
    isSameState,
    notifyMissingEntity,
    refreshAuth,
    saveToStorage,
    setOfflineStorageState,
  ]);

  useEffect(() => {
    if (!auth.isLogged || auth.role === 'guest') return;
    const autoReloadKey = `${storageKey}:${auth.userClientId ?? ''}:${auth.role}`;
    if (autoReloadKeyRef.current === autoReloadKey) {
      return;
    }
    autoReloadKeyRef.current = autoReloadKey;
    void reloadEntity();
  }, [auth.isLogged, auth.role, auth.userClientId, reloadEntity, storageKey]);

  useEffect(() => {
    if (!isClientReady) return;
    if (auth.isLogged && auth.role !== 'guest') return;

    autoReloadKeyRef.current = null;
    notFoundRef.current = false;
    didNotifyRef.current = false;
    const lastEntity = entityRef.current ?? loadFromStorage();
    const local = createLoggedOutLocal(lastEntity);

    setEntity((current) => {
      if (isSameState(current, local)) {
        return current;
      }

      entityRef.current = local;
      saveToStorage(local);
      return local;
    });
    setSource('default');
    setIsOffline(false);
    setLastSyncAt(null);
  }, [
    auth.isLogged,
    auth.role,
    createLoggedOutLocal,
    isClientReady,
    isSameState,
    loadFromStorage,
    saveToStorage,
  ]);

  const updateEntity = useCallback(
    async (patch: Partial<TPatch>) => {
      if (!entityRef.current) return;

      const optimistic = {
        ...entityRef.current,
        ...patch,
      } as T;
      applyEntity(optimistic, {
        source: 'storage',
      });

      if (!auth.isLogged || auth.role === 'guest') return;

      try {
        const remoteEntity = await updateRemote(patch);
        if (remoteEntity) {
          applyEntity(remoteEntity, {
            source: 'server',
            isOffline: false,
            syncedAt: new Date().toISOString(),
          });
        } else {
          await reloadEntity();
        }
      } catch (error) {
        const err = error as { response?: { status?: number } };

        if (err.response?.status === 401 || err.response?.status === 403) {
          try {
            const refreshResult = await refreshAuth();
            if (!refreshResult.syncedFromServer) {
              return;
            }

            const remoteEntity = await updateRemote(patch);
            if (remoteEntity) {
              applyEntity(remoteEntity, {
                source: 'server',
                isOffline: false,
                syncedAt: new Date().toISOString(),
              });
            } else {
              await reloadEntity();
            }
            return;
          } catch (refreshError) {
            if (isOfflineSessionComplementError(refreshError)) {
              setOfflineStorageState();
            }
            return;
          }
        }

        if (isOfflineSessionComplementError(error)) {
          setOfflineStorageState();
        }
      }
    },
    [
      applyEntity,
      auth.isLogged,
      auth.role,
      refreshAuth,
      reloadEntity,
      setOfflineStorageState,
      updateRemote,
    ]
  );

  const setLanguage = useCallback(
    async (language: string) => {
      await updateEntity({ language } as unknown as Partial<TPatch>);
    },
    [updateEntity]
  );

  const setTheme = useCallback(
    async (theme: string) => {
      await updateEntity({ theme } as unknown as Partial<TPatch>);
    },
    [updateEntity]
  );

  const setProfileImage = useCallback(
    async (profileImage: string) => {
      await updateEntity({ profileImage } as unknown as Partial<TPatch>);
    },
    [updateEntity]
  );

  return {
    entity,
    loading,
    source,
    isOffline,
    lastSyncAt,
    reloadEntity,
    updateEntity,
    setLanguage,
    setTheme,
    setProfileImage,
  };
};
