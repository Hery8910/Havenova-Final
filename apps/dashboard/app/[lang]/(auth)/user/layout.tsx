import '../../../global.css';
import styles from './layout.module.css';
import { Metadata } from 'next';

import React from 'react';
import {
  AlertProvider,
  AuthProvider,
  ClientProvider,
  I18nProvider,
  ProfileProvider,
  WorkerProvider,
} from '../../../../../../packages/contexts';
import { getClient } from '../../../../../../packages/services';

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
    <html lang={params.lang} data-theme="light">
      <body className={styles.body}>
        <I18nProvider initialLanguage={params.lang}>
          <AlertProvider>
            <ClientProvider initialClient={client}>
              <AuthProvider>
                <WorkerProvider>{children}</WorkerProvider>
              </AuthProvider>
            </ClientProvider>
          </AlertProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
