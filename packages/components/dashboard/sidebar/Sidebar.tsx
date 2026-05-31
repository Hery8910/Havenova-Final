'use client';

import { LuBell, LuBookOpen, LuLayoutPanelTop, LuListChecks, LuMessagesSquare, LuSettings, LuUsers } from 'react-icons/lu';
import { PiBuildings } from 'react-icons/pi';
import { GrUserManager, GrUserWorker } from 'react-icons/gr';

import { useAuth, useI18n } from '../../../contexts';
import { useLang } from '../../../hooks';
import { href } from '../../../utils/navigation/navigation';
import { SideNav, type SideNavItem } from '../../sideNav';

export default function Sidebar() {
  const { logout } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();
  const sideNavTexts = texts.components?.dashboard?.sideNav;
  const commonTexts = sideNavTexts?.common;
  const dashboardTexts = sideNavTexts?.dashboard?.pages;

  const mainItems: SideNavItem[] = [
    {
      key: 'dashboard',
      label: dashboardTexts?.dashboard ?? 'Dashboard',
      href: href(lang, '/'),
      icon: <LuLayoutPanelTop />,
      match: 'exact',
    },
    {
      key: 'requests',
      label: dashboardTexts?.requests ?? 'Requests',
      href: href(lang, '/requests'),
      icon: <LuListChecks />,
      match: 'prefix',
    },
    {
      key: 'clients',
      label: dashboardTexts?.clients ?? 'Clients',
      href: href(lang, '/clients'),
      icon: <LuUsers />,
      match: 'prefix',
    },
    {
      key: 'property-manager',
      label: dashboardTexts?.propertyManager ?? 'Property Manager',
      href: href(lang, '/property-manager'),
      icon: <GrUserManager />,
      match: 'prefix',
    },
    {
      key: 'objects',
      label: dashboardTexts?.objects ?? 'Objects',
      href: href(lang, '/objects'),
      icon: <PiBuildings />,
      match: 'prefix',
    },
    {
      key: 'global-task-catalog',
      label: dashboardTexts?.taskCatalog ?? 'Task catalog',
      href: href(lang, '/global-task-catalog'),
      icon: <LuBookOpen />,
      match: 'prefix',
    },
    {
      key: 'employees',
      label: dashboardTexts?.employees ?? 'Employees',
      href: href(lang, '/employees'),
      icon: <GrUserWorker />,
      match: 'prefix',
    },
    {
      key: 'messages',
      label: dashboardTexts?.messages ?? 'Messages',
      href: href(lang, '/messages'),
      icon: <LuMessagesSquare />,
      match: 'prefix',
    },
    {
      key: 'notifications',
      label: dashboardTexts?.notifications ?? 'Notifications',
      href: href(lang, '/notifications'),
      icon: <LuBell />,
      match: 'prefix',
    },
  ];

  const footerItems: SideNavItem[] = [
    {
      key: 'settings',
      label: commonTexts?.settings ?? 'Settings',
      href: href(lang, '/profile/edit'),
      icon: <LuSettings />,
      match: 'prefix',
    },
  ];

  return (
    <SideNav
      className="glass-panel--base"
      mainItems={mainItems}
      footerItems={footerItems}
      onLogout={logout}
      logoutLabel={commonTexts?.logout ?? 'Logout'}
      navigationLabel={commonTexts?.navigationLabel ?? 'Section navigation'}
      mainListLabel={commonTexts?.mainListLabel ?? 'Main pages'}
      footerListLabel={commonTexts?.footerListLabel ?? 'Account actions'}
      collapseLabel={commonTexts?.collapse ?? 'Collapse navigation'}
      expandLabel={commonTexts?.expand ?? 'Expand navigation'}
    />
  );
}
