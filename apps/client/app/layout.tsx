// app/layout.tsx (RootLayout)
import { DashboardProvider } from '../../../packages/contexts/user/UserContext';
import { ClientProvider } from '../../../packages/contexts/client/ClientContext';
// import Navbar from '../../../packages/components/navbar/Navbar';
import Footer from '../../../packages/components/footer/Footer';
import { getClient } from '../../../packages/services/clientServices';
import './globals.css';
import { homeMetadata } from './pageMetadata';
import I18nInitializer from '../../../packages/contexts/i18n/I18nInitializer';
import { CookiesProvider } from '../../../packages/contexts/cookies/CookiesContext';
import CookieBanner from '../../../packages/components/cookieBanner/CookieBanner';
import GAScript from '../../../packages/utils/cookies/GAScript';
import Loading from '../../../packages/components/layout/loading/Loading';

export const metadata = homeMetadata;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const domain: string = 'havenova.de';
  const client = await getClient(domain);
  if (!client) return <Loading />;

  return (
    <html lang="de" data-theme="light">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#002442" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
                <CookieBanner />
                {/* <Navbar /> */}
                {children}
                <Footer />
                <GAScript />
              </I18nInitializer>
            </CookiesProvider>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
