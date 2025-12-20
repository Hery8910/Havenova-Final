import '../../global.css';
import styles from './layout.module.css';
import { ClientProvider } from '@/packages/contexts/client/ClientContext';
import { getClient } from '@/packages/services/client';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import Sidebar from '@/packages/components/sidebar/Sidebar';
import { DashboardHeader } from '@/packages/components/dashboard/dashboardHeader';
import React from 'react';
import { AlertProvider } from '@/packages/contexts/';

import { I18nProvider, AuthProvider, ProfileProvider } from '@/packages/contexts/';

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
        <AlertProvider>
          <ClientProvider initialClient={client}>
            <I18nProvider initialLanguage={params.lang}>
              <AuthProvider>
                <ProfileProvider>
                  <div className={styles.layout}>
                    <nav className={styles.nav}>
                      <Sidebar />
                    </nav>
                    <header className={styles.header}>
                      <DashboardHeader />
                    </header>
                    <main className={styles.main}>{children}</main>
                  </div>
                </ProfileProvider>
              </AuthProvider>
            </I18nProvider>
          </ClientProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
