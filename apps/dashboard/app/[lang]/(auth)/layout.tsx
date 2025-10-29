// app/[lang]/(auth)/layout.tsx
import React from 'react';
import { I18nProvider } from '@/packages/contexts/i18n/I18nContext';
import '../../global.css';
import { getClient } from '../../../../../packages/services/client';
import { ClientProvider } from '../../../../../packages/contexts/client/ClientContext';
import { DashboardProvider } from '../../../../../packages/contexts/user';

export async function generateStaticParams() {
  return [{ lang: 'de' }, { lang: 'en' }];
}

export default async function AuthLayout({
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
      <body>
        <ClientProvider initialClient={client}>
          <DashboardProvider>
            <I18nProvider initialLanguage={params.lang}>{children}</I18nProvider>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
