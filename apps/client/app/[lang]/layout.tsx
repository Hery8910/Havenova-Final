// apps/client/src/app/[lang]/layout.tsx
import '../globals.css';
import { ClientProvider } from '@/packages/contexts/client/ClientContext';
import { NavbarContainer } from '@/packages/components/navbar';
import { CookieBannerContainer } from '@/packages/components/cookieBanner';
import { FooterContainer } from '@/packages/components/footer/FooterContainer';
import { getClient } from '@/packages/services/client';
import { CookiesProvider } from '@/packages/contexts/cookies/CookiesContext';
import { I18nProvider, UserProvider } from '@/packages/contexts/';
import { AlertProvider } from '@/packages/contexts/';
import { ServiceCartProvider } from '@/packages/contexts/serviceCart';
import { ServiceCart } from '@/packages/components/services/serviceCart';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import { getPageMetadata } from '@/packages/utils/metadata';
import { ClientContextProps, ClientPublicConfig } from '../../../../packages/types';

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
        <ClientProvider initialClient={client}>
          <AlertProvider>
            <I18nProvider initialLanguage={params.lang}>
              <UserProvider>
                <CookiesProvider>
                  <ServiceCartProvider>
                    <CookieBannerContainer />
                    <NavbarContainer />
                    {children}
                    <ServiceCart />
                    <FooterContainer />
                  </ServiceCartProvider>
                </CookiesProvider>
              </UserProvider>
            </I18nProvider>
          </AlertProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
