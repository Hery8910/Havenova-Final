import '../../global.css';
import styles from './layout.module.css';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import React from 'react';
import { getClient } from '../../../../../packages/services';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  I18nProvider,
  WorkerProvider,
} from '../../../../../packages/contexts';
import DashboardHeader from '../../../../../packages/components/dashboard/dashboardHeader/DashboardHeader';
import { Sidebar } from '../../../../../packages/components';

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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: 'de' | 'en' };
}) {
  const domain = 'havenova.de';
  const client = await getClient(domain);

  return (
    <html
      lang={params.lang}
      data-theme="light"
      className={`${poppins.variable} ${roboto.variable}`}
    >
      <body className={styles.body}>
        <I18nProvider initialLanguage={params.lang}>
          <AlertProvider>
            <ClientProvider initialClient={client}>
              <AuthProvider>
                <WorkerProvider>
                  <div className={styles.layout}>
                    <nav className={styles.nav}>
                      <Sidebar />
                    </nav>
                    <header className={styles.header}>
                      <DashboardHeader />
                    </header>
                    <main className={styles.main}>{children}</main>
                  </div>
                </WorkerProvider>
              </AuthProvider>
            </ClientProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
