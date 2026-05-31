'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useI18n } from '@havenova/contexts/i18n';
import { href } from '@havenova/utils/navigation';
import { useLang } from '@havenova/hooks/useLang';
import type { NavbarConfig } from './navbar.types';
import { useAuth } from '../../../contexts/auth/authContext';
import { useProfile } from '../../../contexts/profile/ProfileContext';
import { getNavbarContent } from './navbar.shared';
import { useDeviceSize } from './hooks/useDeviceSize';
import { NavbarDesktopView } from './NavbarDesktopView/NavbarDesktopView';
import { NavbarTabletView } from './NavbarTabletView/NavbarTabletView';
import { NavbarMobileView } from './NavbarMobileView/NavbarMobileView';
import styles from './NavbarContainer.module.css';

export function NavbarContainer() {
  const { auth, logout } = useAuth();
  const { profile } = useProfile();
  const { texts } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang();
  const deviceSize = useDeviceSize();
  const routeWithoutLang = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const hideProfileAccountControls = routeWithoutLang.startsWith('/profile');

  const navbarConfig: NavbarConfig | undefined = texts?.components?.client?.navbar;
  const mainNavigationLabel =
    navbarConfig?.accessibility?.mainNavigation ?? 'Main navigation';
  const navbarContent = getNavbarContent({
    texts,
    navbarConfig,
    auth,
    profile,
  });

  const handleNavigate = (path: string) => {
    router.push(href(lang, path));
  };

  if (!deviceSize) {
      return (
      <nav className={styles.navbarPlaceholder} aria-hidden="true">
        <div className={`${styles.navbarShell} card card--neutral`}>
          <div className={styles.navbarShellBrand} />
          <div className={styles.navbarShellLinks}>
            <span className={styles.navbarShellItem} />
            <span className={styles.navbarShellItem} />
            <span className={styles.navbarShellItem} />
          </div>
          <div className={styles.navbarShellActions}>
            <span className={styles.navbarShellAction} />
            <span className={styles.navbarShellAction} />
          </div>
        </div>
        <div className={`${styles.navbarShellMobile} card card--neutral`}>
          <span className={styles.navbarShellMobileItem} />
          <span className={styles.navbarShellMobileItem} />
          <span className={styles.navbarShellMobileItem} />
          <span className={styles.navbarShellMobileItem} />
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar} aria-label={mainNavigationLabel}>
      {deviceSize === 'desktop' && (
        <NavbarDesktopView
          content={navbarContent}
          onNavigate={handleNavigate}
          onLogout={logout}
          hideAccountControls={hideProfileAccountControls}
        />
      )}

      {deviceSize === 'tablet' && (
        <NavbarTabletView
          auth={auth}
          content={navbarContent}
          onNavigate={handleNavigate}
          onLogout={logout}
          hideAccountControls={hideProfileAccountControls}
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
