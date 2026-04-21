'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import Loading from '@havenova/components/loading/Loading';
import { useGlobalAlert } from '../alert';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { getI18nFallbacks } from '../i18n';
import { useRouter } from 'next/navigation';

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
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
  initialError?: ClientBootstrapError | null;
}) {
  const [client, setClient] = useState<ClientPublicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const didNotifyRef = useRef(false);
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackPopups } = getI18nFallbacks(language);
  const { showError, showConfirm, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const popups = texts?.popups ?? {};

  useEffect(() => {
    setClient(initialClient);
    setLoading(false);
  }, [initialClient]);

  useEffect(() => {
    if (loading || client || didNotifyRef.current) return;
    didNotifyRef.current = true;

    const status = initialError?.status ?? 500;
    const code = resolveBootstrapCode(initialError);
    const popup = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackPopups.GLOBAL_INTERNAL_ERROR);
    const alertKind = classifyBootstrapError(status, code);

    if (alertKind === 'not_found' || alertKind === 'forbidden') {
      showConfirm({
        response: {
          status,
          title: popup.title,
          description: popup.description,
          confirmLabel:
            popup.confirm ?? popups?.button?.continue ?? fallbackButtons.continue,
          cancelLabel: popup.close ?? popups?.button?.close ?? fallbackButtons.close,
        },
        onConfirm: () => {
          closeAlert();
          router.push(`/${language}`);
        },
        onCancel: closeAlert,
      });
      return;
    }

    if (alertKind === 'retryable') {
      showConfirm({
        response: {
          status,
          title: popup.title,
          description: popup.description,
          confirmLabel: popup.confirm ?? popups?.button?.reload ?? fallbackButtons.reload,
          cancelLabel: popup.close ?? popups?.button?.close ?? fallbackButtons.close,
        },
        onConfirm: () => {
          closeAlert();
          window.location.reload();
        },
        onCancel: closeAlert,
      });
      return;
    }

    showError({
      response: {
        status,
        title: popup.title,
        description: popup.description,
        cancelLabel: popup.close ?? popups?.button?.close ?? fallbackButtons.close,
      },
      onCancel: closeAlert,
    });
  }, [client, closeAlert, loading, showConfirm, showError, popups, initialError, router, language]);

  if (loading) {
    return <Loading theme={'light'} />;
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
