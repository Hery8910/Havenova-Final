// app/dashboard/layout.tsx
import React from 'react';
// import Sidebar from '../../../packages/components/sidebar/Sidebar';

import { MdDashboard } from 'react-icons/md';
import { FaFolder } from 'react-icons/fa6';
import { GrUserWorker } from 'react-icons/gr';
import { MdPeopleAlt } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { RxActivityLog } from 'react-icons/rx';
import { ImBlog } from 'react-icons/im';
import { IoSettingsSharp } from 'react-icons/io5';
import { BiSolidOffer } from 'react-icons/bi';
import I18nInitializer from '../../../packages/contexts/i18n/I18nInitializer';
import { ClientProvider } from '../../../packages/contexts/client/ClientContext';
import { getClient } from '../../../packages/services/clientServices';
import { DashboardProvider } from '../../../packages/contexts/user/UserContext';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const domain: string = 'havenova.de';
  const client = await getClient(domain);
  // if (!client) return <Loadin />;
  const items = [
    { label: 'Dashboard', href: '/dashboard', icon: <MdDashboard /> },
    { label: 'Requests', href: '/dashboard/requests', icon: <FaFolder /> },
    { label: 'Employees', href: '/dashboard/employees', icon: <GrUserWorker /> },
    { label: 'Clients', href: '/dashboard/clients', icon: <MdPeopleAlt /> },
    { label: 'Notifications', href: '/dashboard/notifications', icon: <IoNotifications /> },
    { label: 'Activity', href: '/dashboard/activity', icon: <RxActivityLog /> },
    { label: 'Offers', href: '/dashboard/offer', icon: <BiSolidOffer /> },
    { label: 'Blogs', href: '/dashboard/blog', icon: <ImBlog /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <IoSettingsSharp /> },
  ];

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
            <I18nInitializer>
              {/* <Sidebar items={items} context="admin-dashboard" /> */}
              {children}
            </I18nInitializer>
          </DashboardProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
