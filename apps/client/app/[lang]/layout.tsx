// apps/client/src/app/[lang]/layout.tsx
import '../globals.css';
import { DashboardProvider } from '@/packages/contexts/user/UserContext';
import { ClientProvider } from '@/packages/contexts/client/ClientContext';
import { NavbarContainer } from '@/packages/components/navbar';
import { CookieBannerContainer } from '@/packages/components/cookieBanner';
import { FooterContainer } from '@/packages/components/footer/FooterContainer';
import { getClient } from '@/packages/services/client';
import { CookiesProvider } from '@/packages/contexts/cookies/CookiesContext';
import { I18nProvider } from '@/packages/contexts/';
import { AlertProvider } from '@/packages/contexts/';
import { ServiceCartProvider } from '@/packages/contexts/serviceCart';
import { ServiceCart } from '@/packages/components/services/serviceCart';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import { getPageMetadata } from '@/packages/utils/metadata';

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
  const client = await getClient(domain);

  return (
    <html
      lang={params.lang}
      data-theme="light"
      className={`${poppins.variable} ${roboto.variable}`}
    >
      <body>
        <ClientProvider initialClient={client}>
          <DashboardProvider>
            <CookiesProvider>
              <I18nProvider initialLanguage={params.lang}>
                <ServiceCartProvider>
                  <AlertProvider>
                    <CookieBannerContainer />
                    <NavbarContainer />
                    {children}
                    <ServiceCart />
                    <FooterContainer />
                  </AlertProvider>
                </ServiceCartProvider>
              </I18nProvider>
            </CookiesProvider>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
