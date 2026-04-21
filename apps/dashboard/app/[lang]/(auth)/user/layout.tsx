import '../../../global.css';
import styles from './layout.module.css';
import { Metadata } from 'next';
import { headers } from 'next/headers';

import React from 'react';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  I18nProvider,
  ProfileProvider,
  WorkerProvider,
} from '../../../../../../packages/contexts';
import {
  assertAllowedAppHost,
  getClient,
  resolveRequestHost,
  resolveTenantKey,
} from '../../../../../../packages/services';

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
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
  params: { lang: 'de' | 'en' };
}) {
  const requestHost = resolveRequestHost(headers());
  assertAllowedAppHost(requestHost);
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
    <html lang={params.lang} data-theme="light">
      <body className={styles.body}>
        <I18nProvider initialLanguage={params.lang}>
          <AlertProvider>
            <ClientProvider initialClient={client} initialError={clientError}>
              <AuthProvider>
                <WorkerProvider>{children}</WorkerProvider>
              </AuthProvider>
            </ClientProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
