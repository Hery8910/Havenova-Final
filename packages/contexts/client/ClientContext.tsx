'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import Loading from '@havenova/components/loading/Loading';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { getI18nFallbacks } from '../i18n';
import { useRouter } from 'next/navigation';
import { getClient } from '../../services/client/clientServices';
import { useGlobalAlert } from '../alert';
import { PopupCode } from '../alert/alert.types';
import { ClientBootstrapFallback } from './ClientBootstrapFallback';

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

type ClientBootstrapFallbackState = {
  status: number;
  code: string;
  message?: string;
  alertKind: ClientBootstrapAlertKind;
};

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
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
  initialError?: ClientBootstrapError | null;
  tenantKey?: string | null;
}) {
  const isDevBootstrapFallbackEnabled = process.env.NODE_ENV !== 'production';
  const [client, setClient] = useState<ClientPublicConfig | null>(initialClient);
  const [loading, setLoading] = useState(!initialClient && !initialError);
  const [devBootstrapFallback, setDevBootstrapFallback] =
    useState<ClientBootstrapFallbackState | null>(() => {
      if (!isDevBootstrapFallbackEnabled || !initialError) {
        return null;
      }

      const code = resolveBootstrapCode(initialError);
      return {
        status: initialError.status ?? 500,
        code,
        message: initialError.message,
        alertKind: classifyBootstrapError(initialError.status ?? 500, code),
      };
    });
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError } = getI18nFallbacks(language);
  const router = useRouter();
  const { showError, closeAlert } = useGlobalAlert();
  const popups = texts?.popups ?? {};
  const presentedBootstrapAlertRef = useRef<string | null>(null);

  const presentBootstrapAlert = (
    failure: Pick<ClientBootstrapFallbackState, 'status' | 'code' | 'message' | 'alertKind'>
  ) => {
    const popupDefaultKey = getBootstrapPopupDefaultKey(failure.code);
    const popup = getPopup(popups, failure.code, popupDefaultKey, fallbackGlobalError);

    const goHome = () => {
      closeAlert();
      router.push(`/${language}`);
    };

    const reloadPage = () => {
      closeAlert();
      window.location.reload();
    };

    if (failure.alertKind === 'retryable') {
      showError({
        response: {
          status: failure.status,
          title: popup.title,
          description: popup.description,
          confirmLabel: popup.confirm ?? popups?.button?.reload ?? fallbackButtons.reload,
          cancelLabel: popups?.button?.continue ?? fallbackButtons.continue,
        },
        onConfirm: reloadPage,
        onCancel: goHome,
      });
      return;
    }

    showError({
      response: {
        status: failure.status,
        title: popup.title,
        description: popup.description,
        confirmLabel: popup.confirm ?? popups?.button?.continue ?? fallbackButtons.continue,
        cancelLabel:
          failure.alertKind === 'dismiss_only'
            ? popups?.button?.close ?? fallbackButtons.close
            : popups?.button?.continue ?? fallbackButtons.continue,
      },
      onConfirm: goHome,
      onCancel: goHome,
    });
  };

  useEffect(() => {
    setClient(initialClient);
    presentedBootstrapAlertRef.current = null;

    if (isDevBootstrapFallbackEnabled) {
      if (initialError) {
        const code = resolveBootstrapCode(initialError);
        setDevBootstrapFallback({
          status: initialError.status ?? 500,
          code,
          message: initialError.message,
          alertKind: classifyBootstrapError(initialError.status ?? 500, code),
        });
      } else {
        setDevBootstrapFallback(null);
      }
    }

    if (initialClient || initialError) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const bootstrapClient = async () => {
      try {
        const resolvedClient = await getClient(tenantKey ?? undefined);
        if (!cancelled) {
          setClient(resolvedClient);
          setDevBootstrapFallback(null);
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

          if (isDevBootstrapFallbackEnabled) {
            setDevBootstrapFallback(failure);
          }

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
  }, [initialClient, initialError, isDevBootstrapFallbackEnabled, tenantKey]);

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
    return <Loading theme={'light'} />;
  }

  if (!client) {
    if (!isDevBootstrapFallbackEnabled) {
      return null;
    }

    if (!devBootstrapFallback) {
      return null;
    }

    const popupDefaultKey = getBootstrapPopupDefaultKey(devBootstrapFallback.code);
    const popup = getPopup(popups, devBootstrapFallback.code, popupDefaultKey, fallbackGlobalError);
    const meta = [devBootstrapFallback.code, devBootstrapFallback.message].filter(Boolean).join(' · ');

    if (devBootstrapFallback.alertKind === 'retryable') {
      return (
        <ClientBootstrapFallback
          title={popup.title}
          description={popup.description}
          primaryLabel={popup.confirm ?? popups?.button?.reload ?? fallbackButtons.reload}
          onPrimary={() => window.location.reload()}
          secondaryLabel={popups?.button?.continue ?? fallbackButtons.continue}
          onSecondary={() => router.push(`/${language}`)}
          meta={meta}
        />
      );
    }

    return (
      <ClientBootstrapFallback
        title={popup.title}
        description={popup.description}
        primaryLabel={popup.confirm ?? popups?.button?.continue ?? fallbackButtons.continue}
        onPrimary={() => router.push(`/${language}`)}
        meta={meta}
      />
    );
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
