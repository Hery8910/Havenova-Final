'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { getI18nFallbacks } from '../i18n';
import { useRouter } from 'next/navigation';
import { getClient } from '../../services/client/clientServices';
import { useGlobalAlert } from '../alert';
import { PopupCode } from '../alert/alert.types';

const CLIENT_BOOTSTRAP_RETRY_LIMIT = 3;

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

type ClientBootstrapError = {
  status: number;
  code?: string;
  message?: string;
};

type ClientBootstrapAlertKind =
  | 'retryable'
  | 'not_found'
  | 'forbidden'
  | 'invalid_request'
  | 'dismiss_only';

type ClientBootstrapFailure = {
  status: number;
  code: string;
  message?: string;
  alertKind: ClientBootstrapAlertKind;
};

function getBootstrapRetryStorageKey(tenantKey?: string | null) {
  return `hv-client-bootstrap-retries:${tenantKey ?? 'unknown'}`;
}

function readBootstrapRetryCount(tenantKey?: string | null): number {
  if (typeof window === 'undefined') return 0;

  const raw = window.sessionStorage.getItem(getBootstrapRetryStorageKey(tenantKey));
  const count = Number(raw);

  return Number.isFinite(count) && count > 0 ? count : 0;
}

function writeBootstrapRetryCount(tenantKey: string | null | undefined, count: number) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(getBootstrapRetryStorageKey(tenantKey), String(count));
}

function clearBootstrapRetryCount(tenantKey?: string | null) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(getBootstrapRetryStorageKey(tenantKey));
}

function getRetryBlockedDescription(
  language: string,
  baseDescription?: string
): string {
  const suffix =
    language === 'de'
      ? 'Zu viele Versuche erkannt. Bitte versuchen Sie es später erneut.'
      : language === 'es'
        ? 'Se detectaron demasiados intentos. Inténtalo de nuevo más tarde.'
        : 'Too many attempts were detected. Please try again later.';

  return [baseDescription, suffix].filter(Boolean).join(' ');
}

function resolveBootstrapCode(error?: ClientBootstrapError | null): string {
  const status = error?.status ?? 500;

  if (error?.code) {
    return error.code;
  }

  if (status === 404) {
    return 'CLIENT_NOT_FOUND';
  }

  if (status === 400) {
    return 'VALIDATION_ERROR';
  }

  if (status === 403) {
    return 'AUTH_FORBIDDEN';
  }

  return 'GLOBAL_INTERNAL_ERROR';
}

function getBootstrapPopupDefaultKey(code: string): PopupCode {
  switch (code) {
    case 'CLIENT_NOT_FOUND':
      return 'CLIENT_NOT_FOUND';
    case 'VALIDATION_ERROR':
      return 'VALIDATION_ERROR';
    case 'AUTH_FORBIDDEN':
      return 'AUTH_FORBIDDEN';
    default:
      return 'GLOBAL_INTERNAL_ERROR';
  }
}

function classifyBootstrapError(status: number, code: string): ClientBootstrapAlertKind {
  if (code === 'CLIENT_NOT_FOUND') {
    return 'not_found';
  }

  if (code === 'AUTH_FORBIDDEN' || (status === 403 && code.startsWith('AUTH_'))) {
    return 'forbidden';
  }

  if (code === 'VALIDATION_ERROR' || status === 400) {
    return 'invalid_request';
  }

  if (status >= 500 || status === 0 || code === 'GLOBAL_INTERNAL_ERROR') {
    return 'retryable';
  }

  return 'dismiss_only';
}

export function ClientProvider({
  children,
  initialClient,
  initialError,
  tenantKey,
  loadingFallback = null,
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
  initialError?: ClientBootstrapError | null;
  tenantKey?: string | null;
  loadingFallback?: ReactNode;
}) {
  const [client, setClient] = useState<ClientPublicConfig | null>(initialClient);
  const [loading, setLoading] = useState(!initialClient && !initialError);
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError } = getI18nFallbacks(language);
  const router = useRouter();
  const { showError, closeAlert } = useGlobalAlert();
  const popups = texts?.popups ?? {};
  const presentedBootstrapAlertRef = useRef<string | null>(null);

  const presentBootstrapAlert = (failure: ClientBootstrapFailure) => {
    const popupDefaultKey = getBootstrapPopupDefaultKey(failure.code);
    const popup = getPopup(popups, failure.code, popupDefaultKey, fallbackGlobalError);
    const retryCount = readBootstrapRetryCount(tenantKey);
    const retryBlocked =
      failure.alertKind === 'retryable' && retryCount >= CLIENT_BOOTSTRAP_RETRY_LIMIT;

    const goHome = () => {
      closeAlert();
      router.push(`/${language}`);
    };

    const reloadPage = () => {
      closeAlert();
      writeBootstrapRetryCount(tenantKey, retryCount + 1);
      window.location.reload();
    };

    if (retryBlocked) {
      showError({
        response: {
          status: failure.status,
          title: popup.title,
          description: getRetryBlockedDescription(language, popup.description),
          cancelLabel: '',
        },
      });
      return;
    }

    if (failure.alertKind === 'retryable') {
      showError({
        response: {
          status: failure.status,
          title: popup.title,
          description: popup.description,
          confirmLabel: popup.confirm ?? popups?.button?.reload ?? fallbackButtons.reload,
        },
        onConfirm: reloadPage,
      });
      return;
    }

    if (failure.alertKind === 'not_found' || failure.alertKind === 'forbidden') {
      showError({
        response: {
          status: failure.status,
          title: popup.title,
          description: popup.description,
          cancelLabel: popups?.button?.goToHome ?? fallbackButtons.goToHome,
        },
        onCancel: goHome,
      });
      return;
    }

    showError({
      response: {
        status: failure.status,
        title: popup.title,
        description: popup.description,
        cancelLabel:
          failure.alertKind === 'dismiss_only'
            ? popups?.button?.close ?? fallbackButtons.close
            : popups?.button?.continue ?? fallbackButtons.continue,
      },
      onCancel: goHome,
    });
  };

  useEffect(() => {
    setClient(initialClient);
    presentedBootstrapAlertRef.current = null;

    if (initialClient || initialError) {
      if (initialClient) {
        clearBootstrapRetryCount(tenantKey);
      }
      setLoading(false);
      return;
    }

    let cancelled = false;

    const bootstrapClient = async () => {
      try {
        const resolvedClient = await getClient(tenantKey ?? undefined);
        if (!cancelled) {
          setClient(resolvedClient);
          clearBootstrapRetryCount(tenantKey);
        }
      } catch (error: any) {
        if (!cancelled) {
          const status = error?.response?.status ?? 500;
          const code = resolveBootstrapCode({
            status,
            code: error?.response?.data?.code,
            message: error?.response?.data?.message ?? error?.message,
          });
          const failure = {
            status,
            code,
            message: error?.response?.data?.message ?? error?.message,
            alertKind: classifyBootstrapError(status, code),
          };

          const alertSignature = `${tenantKey ?? 'no-tenant'}:${status}:${code}:${failure.message ?? ''}`;
          if (presentedBootstrapAlertRef.current !== alertSignature) {
            presentedBootstrapAlertRef.current = alertSignature;
            presentBootstrapAlert(failure);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void bootstrapClient();

    return () => {
      cancelled = true;
    };
  }, [initialClient, initialError, tenantKey]);

  useEffect(() => {
    if (loading || client || !initialError) {
      return;
    }

    const status = initialError.status ?? 500;
    const code = resolveBootstrapCode(initialError);
    const alertKind = classifyBootstrapError(status, code);
    const alertSignature = `${tenantKey ?? 'no-tenant'}:${status}:${code}:${initialError.message ?? ''}`;

    if (presentedBootstrapAlertRef.current === alertSignature) {
      return;
    }

    presentedBootstrapAlertRef.current = alertSignature;
    presentBootstrapAlert({
      status,
      code,
      message: initialError.message,
      alertKind,
    });
  }, [
    client,
    initialError,
    loading,
    presentBootstrapAlert,
    tenantKey,
  ]);

  if (loading) {
    return <>{loadingFallback}</>;
  }

  if (!client) {
    return null;
  }

  return (
    <ClientContext.Provider value={{ client, loading: false }}>{children}</ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
