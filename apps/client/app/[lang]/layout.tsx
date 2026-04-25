// apps/client/src/app/[lang]/layout.tsx
import '../global.css';
import type { Locale } from '@havenova/i18n';
import type { ClientPublicConfig } from '../../../../packages/types/client/clientTypes';
import { resolveTenantKey } from '../../../../packages/services/client/tenantResolver';
import { getClient } from '../../../../packages/services/client/clientServices';
import { AlertProvider } from '../../../../packages/contexts/alert/AlertContext';
import { AuthProvider } from '../../../../packages/contexts/auth/authContext';
import { ClientProvider } from '../../../../packages/contexts/client/ClientContext';
import { CookiesProvider } from '../../../../packages/contexts/cookies/CookiesContext';
import { I18nProvider } from '../../../../packages/contexts/i18n/I18nContext';
import { ProfileProvider } from '../../../../packages/contexts/profile/ProfileContext';
import { CookieBannerContainer } from '../../../../packages/components/cookieBanner';

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
    <html lang={params.lang} data-theme="light" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (error) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
        <I18nProvider initialLanguage={params.lang}>
          <AlertProvider>
            <ClientProvider
              initialClient={initialClient}
              initialError={clientError}
              tenantKey={tenantKey}
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
      </body>
    </html>
  );
}
