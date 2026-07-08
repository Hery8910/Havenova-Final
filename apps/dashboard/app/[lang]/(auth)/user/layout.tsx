import styles from './layout.module.css';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import React from 'react';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  I18nProvider,
} from '../../../../../../packages/contexts';
import { AlertViewport } from '../../../../../../packages/components/alert';
import Loading from '../../../../../../packages/components/loading/Loading';
import {
  assertAllowedAppHost,
  getClient,
  getServerAuthUser,
  resolveRequestHost,
  resolveTenantKey,
} from '../../../../../../packages/services';

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }, { lang: 'es' }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}): Promise<Metadata> {
  return {
    title: params.lang === 'de' ? 'Dashboard | Havenova' : 'Dashboard | Havenova',
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'de' | 'en' | 'es' };
}) {
  const requestHeaders = headers();
  const requestHost = resolveRequestHost(requestHeaders);
  assertAllowedAppHost(requestHost);
  const auth = await getServerAuthUser(requestHeaders);
  const tenantKey = resolveTenantKey();
  let client: Awaited<ReturnType<typeof getClient>> | null = null;
  let clientError: { status: number; code?: string; message?: string } | null = null;

  try {
    client = await getClient(tenantKey);
  } catch (error: any) {
    clientError = {
      status: error?.response?.status ?? 500,
      code: error?.response?.data?.code,
      message: error?.response?.data?.message ?? error?.message,
    };
    console.error('⚠️ Could not load client:', error);
  }

  return (
    <I18nProvider initialLanguage={params.lang}>
      <AlertProvider>
        <AlertViewport />
        <ClientProvider
          initialClient={client}
          initialError={clientError}
          tenantKey={tenantKey}
          loadingFallback={<Loading theme="light" />}
        >
          <AuthProvider
            initialAuth={auth}
            disableUnauthenticatedBootstrap
          >
            {children}
          </AuthProvider>
        </ClientProvider>
      </AlertProvider>
    </I18nProvider>
  );
}
