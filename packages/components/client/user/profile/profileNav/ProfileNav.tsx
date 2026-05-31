'use client';

import { FaBell, FaCog, FaListUl, FaUser } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';

import { useAuth } from '../../../../../contexts/auth/authContext';
import { useI18n } from '../../../../../contexts/i18n/I18nContext';
import { useLang } from '../../../../../hooks/useLang';
import { href } from '../../../../../utils/navigation';
import { SideNav, type SideNavItem } from '../../../../sideNav';

export function ProfileNav() {
  const { logout } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();
  const sideNavTexts = texts.components?.dashboard?.sideNav;
  const commonTexts = sideNavTexts?.common;
  const userTexts = sideNavTexts?.user?.pages;

  const mainItems: SideNavItem[] = [
    {
      key: 'overview',
      label: userTexts?.overview ?? 'Overview',
      href: href(lang, '/profile'),
      icon: <FaUser aria-hidden />,
      match: 'exact',
    },
    {
      key: 'work-orders',
      label: userTexts?.workOrders ?? 'Work orders',
      href: href(lang, '/profile/orders'),
      icon: <FaBriefcase aria-hidden />,
      match: 'prefix',
    },
    {
      key: 'work-requests',
      label: userTexts?.workRequests ?? 'Work requests',
      href: href(lang, '/profile/requests'),
      icon: <FaListUl aria-hidden />,
      match: 'prefix',
    },
    {
      key: 'notifications',
      label: userTexts?.notifications ?? 'Notifications',
      href: href(lang, '/profile/notifications'),
      icon: <FaBell aria-hidden />,
      match: 'prefix',
    },
  ];

  const footerItems: SideNavItem[] = [
    {
      key: 'settings',
      label: commonTexts?.settings ?? 'Settings',
      href: href(lang, '/profile/settings'),
      icon: <FaCog aria-hidden />,
      match: 'prefix',
    },
  ];

  return (
    <SideNav
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
