'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@havenova/contexts/i18n';
import { href } from '@havenova/utils/navigation';
import { useLang } from '@havenova/hooks/useLang';
import type { NavbarConfig } from './navbar.types';
import { useAuth } from '../../../contexts/auth/authContext';
import { useProfile } from '../../../contexts';
import { getNavbarContent } from './navbar.shared';
import { useDeviceSize } from './hooks/useDeviceSize';
import { NavbarDesktopView } from './NavbarDesktopView/NavbarDesktopView';
import { NavbarTabletView } from './NavbarTabletView/NavbarTabletView';
import { NavbarMobileView } from './NavbarMobileView/NavbarMobileView';
import styles from './NavbarContainer.module.css';

export function NavbarContainer() {
  const { profile } = useProfile();
  const { auth, logout } = useAuth();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const deviceSize = useDeviceSize();

  const navbarConfig: NavbarConfig | undefined = texts?.components?.client?.navbar;
  const mainNavigationLabel =
    navbarConfig?.accessibility?.mainNavigation ?? 'Main navigation';
  const navbarContent = getNavbarContent({
    texts,
    navbarConfig,
    auth,
  });

  const handleNavigate = (path: string) => {
    router.push(href(lang, path));
  };

  if (!profile) return null;

  if (!deviceSize) {
    return <nav className={styles.navbarPlaceholder} aria-hidden="true" />;
  }

  return (
    <nav className={styles.navbar} aria-label={mainNavigationLabel}>
      {deviceSize === 'desktop' && (
        <NavbarDesktopView content={navbarContent} onNavigate={handleNavigate} onLogout={logout} />
      )}

      {deviceSize === 'tablet' && (
        <NavbarTabletView
          auth={auth}
          content={navbarContent}
          onNavigate={handleNavigate}
          onLogout={logout}
        />
      )}

      {deviceSize === 'mobile' && (
        <NavbarMobileView
          auth={auth}
          content={navbarContent}
          onNavigate={handleNavigate}
          onLogout={logout}
        />
      )}
    </nav>
  );
}
