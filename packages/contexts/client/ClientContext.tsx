'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import Loading from '@havenova/components/loading/Loading';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { getI18nFallbacks } from '../i18n';
import { useRouter } from 'next/navigation';
import { ClientBootstrapFallback } from './ClientBootstrapFallback';
import { getClient } from '../../services/client/clientServices';

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
  tenantKey,
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
  initialError?: ClientBootstrapError | null;
  tenantKey?: string | null;
}) {
  const [client, setClient] = useState<ClientPublicConfig | null>(initialClient);
  const [loading, setLoading] = useState(!initialClient && !initialError);
  const [bootstrapError, setBootstrapError] = useState<ClientBootstrapError | null>(
    initialError ?? null
  );
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackPopups } = getI18nFallbacks(language);
  const router = useRouter();
  const popups = texts?.popups ?? {};

  useEffect(() => {
    setClient(initialClient);
    setBootstrapError(initialError ?? null);

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
          setBootstrapError(null);
        }
      } catch (error: any) {
        if (!cancelled) {
          setBootstrapError({
          status: error?.response?.status ?? 500,
          code: error?.response?.data?.code,
          message: error?.response?.data?.message ?? error?.message,
          });
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

  if (loading) {
    return <Loading theme={'light'} />;
  }

  if (!client) {
    const status = bootstrapError?.status ?? 500;
    const code = resolveBootstrapCode(bootstrapError);
    const popup = getPopup(
      popups,
      code,
      'GLOBAL_INTERNAL_ERROR',
        fallbackPopups.GLOBAL_INTERNAL_ERROR
    );
    const alertKind = classifyBootstrapError(status, code);
    const meta =
      process.env.NODE_ENV !== 'production'
        ? [code, bootstrapError?.message].filter(Boolean).join(' · ')
        : undefined;

    if (alertKind === 'not_found' || alertKind === 'forbidden') {
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

    if (alertKind === 'retryable') {
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
        primaryLabel={popups?.button?.continue ?? fallbackButtons.continue}
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
