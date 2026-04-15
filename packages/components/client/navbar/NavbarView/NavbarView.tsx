import styles from './NavbarView.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import { NavbarDesktopView } from '../NavbarDesktopView/NavbarDesktopView';
import { NavbarTabletView } from '../NavbarTabletView/NavbarTabletView';
import { NavbarMobileView } from '../NavbarMobileView/NavbarMobileView';
import type { NavbarConfig } from '../navbar.types';

export interface NavbarViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  deviceSize: 'mobile' | 'tablet' | 'desktop';
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (href: string) => void;
  onCloseMenu: () => void;
  mainNavigationLabel: string;
}

export function NavbarView({
  profile,
  auth,
  navbarConfig,
  deviceSize,
  menuOpen,
  onToggleMenu,
  onNavigate,
  onCloseMenu,
  mainNavigationLabel,
}: NavbarViewProps) {
  if (!profile) return null;

  return (
    <nav className={styles.navbar} aria-label={mainNavigationLabel}>
      {deviceSize === 'desktop' && (
        <NavbarDesktopView
          profile={profile}
          auth={auth}
          navbarConfig={navbarConfig}
          onNavigate={onNavigate}
        />
      )}

      {deviceSize === 'tablet' && (
        <NavbarTabletView
          profile={profile}
          auth={auth}
          navbarConfig={navbarConfig}
          menuOpen={menuOpen}
          onToggleMenu={onToggleMenu}
          onNavigate={onNavigate}
          onCloseMenu={onCloseMenu}
        />
      )}

      {deviceSize === 'mobile' && (
        <NavbarMobileView
          profile={profile}
          auth={auth}
          navbarConfig={navbarConfig}
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
}
