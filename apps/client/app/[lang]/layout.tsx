// apps/client/src/app/[lang]/layout.tsx
import '../global.css';
import type { Locale } from '@havenova/i18n';
import type { ClientPublicConfig } from '../../../../packages/types';
import { getClient, resolveTenantKey } from '../../../../packages/services';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  CookiesProvider,
  I18nProvider,
  ProfileProvider,
} from '../../../../packages/contexts';
import { AlertViewport } from '../../../../packages/components/alert';
import { CookieBannerContainer } from '../../../../packages/components/cookieBanner';
import Loading from '../../../../packages/components/loading/Loading';

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }, { lang: 'es' }];
}

type TenantBootstrapError = Error & {
  response?: {
    status?: number;
    data?: {
      code?: string;
      message?: string;
    };
  };
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  let initialClient: ClientPublicConfig | null = null;
  let clientError: { status: number; code?: string; message?: string } | null = null;
  let tenantKey: string | null = null;

  try {
    tenantKey = resolveTenantKey();
    initialClient = await getClient(tenantKey);
  } catch (error: unknown) {
    const resolvedError = error as TenantBootstrapError;
    clientError = {
      status: resolvedError?.response?.status ?? 500,
      code: resolvedError?.response?.data?.code,
      message: resolvedError?.response?.data?.message ?? resolvedError?.message,
    };
    console.error('⚠️ Could not load client:', resolvedError);
  }

  return (
    <>
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
      <I18nProvider initialLanguage={params.lang}>
        <AlertProvider>
          <AlertViewport />
          <ClientProvider
            initialClient={initialClient}
            initialError={clientError}
            tenantKey={tenantKey}
            loadingFallback={<Loading theme="light" />}
          >
            <AuthProvider>
              <ProfileProvider>
                <CookiesProvider>
                  {children}
                  <CookieBannerContainer />
                </CookiesProvider>
              </ProfileProvider>
            </AuthProvider>
          </ClientProvider>
        </AlertProvider>
      </I18nProvider>
    </>
  );
}
