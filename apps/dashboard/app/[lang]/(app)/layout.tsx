import '../../global.css';
import styles from './layout.module.css';
import { ClientProvider } from '@/packages/contexts/client/ClientContext';
import { DashboardProvider, useUser } from '@/packages/contexts/user/UserContext';
import { I18nProvider } from '@/packages/contexts/i18n/I18nContext';
import { getClient } from '@/packages/services/client';
import { Poppins, Roboto } from 'next/font/google';
import { Metadata } from 'next';
import Sidebar from '@/packages/components/sidebar/Sidebar';
import { DashboardHeader } from '@/packages/components/dashboard/dashboardHeader';
import React from 'react';
import { MdDashboard, MdPeopleAlt } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa';
import { GrUserWorker } from 'react-icons/gr';
import { IoNotifications, IoSettingsSharp } from 'react-icons/io5';
import { RxActivityLog } from 'react-icons/rx';
import { BiSolidOffer } from 'react-icons/bi';
import { ImBlog } from 'react-icons/im';
import { redirect } from 'next/navigation';

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

  const items = [
    { label: 'Dashboard', href: `/`, icon: <MdDashboard /> },
    { label: 'Requests', href: `/requests`, icon: <FaFolder /> },
    { label: 'Employees', href: `/employees`, icon: <GrUserWorker /> },
    { label: 'Clients', href: `/clients`, icon: <MdPeopleAlt /> },
    {
      label: 'Notifications',
      href: `/notifications`,
      icon: <IoNotifications />,
    },
    { label: 'Activity', href: `/activity`, icon: <RxActivityLog /> },
    { label: 'Offers', href: `/offer`, icon: <BiSolidOffer /> },
    { label: 'Blog', href: `/blog`, icon: <ImBlog /> },
    { label: 'Havenova', href: `/profile`, icon: <IoSettingsSharp /> },
  ];

  return (
    <html
      lang={params.lang}
      data-theme="light"
      className={`${poppins.variable} ${roboto.variable}`}
    >
      <body className={styles.body}>
        <ClientProvider initialClient={client}>
          <DashboardProvider>
            <I18nProvider initialLanguage={params.lang}>
              <div className={styles.wrapper}>
                <nav className={styles.nav}>
                  <Sidebar items={items} context="admin-dashboard" />
                </nav>
                <header className={styles.header}>
                  <DashboardHeader />
                </header>
                <main className={`${styles.main} card`}>{children}</main>
              </div>
            </I18nProvider>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
