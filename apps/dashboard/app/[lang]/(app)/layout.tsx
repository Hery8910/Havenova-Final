import styles from './layout.module.css';
import { Metadata } from 'next';
import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  assertAllowedAppHost,
  getClient,
  getServerAuthUser,
  hasDashboardAccess,
  resolveRequestHost,
  resolveTenantKey,
} from '../../../../../packages/services';
import {
  AdminProvider,
  AlertProvider,
  AuthProvider,
  ClientProvider,
  I18nProvider,
} from '../../../../../packages/contexts';
import { AlertViewport } from '../../../../../packages/components/alert';
import Loading from '../../../../../packages/components/loading/Loading';
import { href, userAuthRoutes } from '../../../../../packages/utils';
import { DashboardWorkspaceShell } from './components/shell';

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
  if (!hasDashboardAccess(auth)) {
    redirect(href(params.lang, userAuthRoutes.login));
  }

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
    <html lang={params.lang} suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              try {
                var storedTheme = localStorage.getItem('theme');
                var theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
                document.documentElement.setAttribute('lang', ${JSON.stringify(params.lang)});
                document.documentElement.setAttribute('data-theme', theme);
              } catch (error) {
                document.documentElement.setAttribute('lang', ${JSON.stringify(params.lang)});
                document.documentElement.setAttribute('data-theme', 'light');
              }
            })();
          `,
        }}
      />
      <body className={styles.body}>
        <I18nProvider initialLanguage={params.lang}>
          <AlertProvider>
            <AlertViewport />
            <ClientProvider
              initialClient={client}
              initialError={clientError}
              tenantKey={tenantKey}
              loadingFallback={<Loading theme="light" />}
            >
              <AuthProvider initialAuth={auth} disableUnauthenticatedBootstrap>
                <AdminProvider>
                  <DashboardWorkspaceShell>{children}</DashboardWorkspaceShell>
                </AdminProvider>
              </AuthProvider>
            </ClientProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
