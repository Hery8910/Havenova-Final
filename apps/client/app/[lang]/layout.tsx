// apps/client/src/app/[lang]/layout.tsx
import '../global.css';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import { ClientPublicConfig } from '../../../../packages/types';
import { getPageMetadata } from '../../../../packages/utils/metadata';
import { getClient } from '../../../../packages/services';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  CookiesProvider,
  I18nProvider,
  ProfileProvider,
} from '../../../../packages/contexts';
import { CookieBannerContainer } from '../../../../packages/components';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'home');
}

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-family-heading',
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-family-body',
});

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'de' | 'en' };
}) {
  const domain: string = 'havenova.de';
  let client: ClientPublicConfig | null = null;

  try {
    client = await getClient(domain);
  } catch (error) {
    console.error('⚠️ Could not load client:', error);
  }

  return (
    <html
      lang={params.lang}
      data-theme="light"
      className={`${poppins.variable} ${roboto.variable}`}
    >
      <body>
        <AlertProvider>
          <I18nProvider initialLanguage={params.lang}>
            <ClientProvider initialClient={client}>
              <AuthProvider>
                <ProfileProvider>
                  <CookiesProvider>
                    {children}
                    <CookieBannerContainer />
                  </CookiesProvider>
                </ProfileProvider>
              </AuthProvider>
            </ClientProvider>
          </I18nProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
