// app/layout.tsx (RootLayout)
import './globals.css';
import { DashboardProvider } from '../../../packages/contexts/user/UserContext';
import { ClientProvider } from '../../../packages/contexts/client/ClientContext';
import { NavbarContainer, NavbarSkeleton } from '@/packages/components/navbar';
import { CookieBannerContainer } from '@/packages/components/cookieBanner';
import { FooterContainer } from '@/packages/components/footer/FooterContainer';
import { getClient } from '../../../packages/services/client';
import './globals.css';
import { homeMetadata } from './pageMetadata';
import I18nInitializer from '../../../packages/contexts/i18n/I18nInitializer';
import { CookiesProvider } from '../../../packages/contexts/cookies/CookiesContext';
import Loading from '../../../packages/components/loading/Loading';
import { Poppins, Roboto } from 'next/font/google';

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

export const metadata = homeMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const domain: string = 'havenova.de';
  const client = await getClient(domain);

  return (
    <html lang="de" data-theme="light" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#002442" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Apple icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Favicon fallback */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16-light.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32-light.png" />
      </head>
      <body>
        <ClientProvider initialClient={client}>
          <DashboardProvider>
            <CookiesProvider>
              <I18nInitializer>
                <CookieBannerContainer />
                <NavbarContainer />
                {children}
                <FooterContainer />
              </I18nInitializer>
            </CookiesProvider>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
