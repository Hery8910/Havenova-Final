import styles from './NavbarView.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import { NavbarDesktopView } from '../NavbarDesktopView/NavbarDesktopView';
import { NavbarTabletView } from '../NavbarTabletView/NavbarTabletView';
import { NavbarMobileView } from '../NavbarMobileView/NavbarMobileView';

export interface BaseNavItem {
  label: string;
  href: string;
}

export interface IconNavItem extends BaseNavItem {
  image: string;
  alt: string;
}

export interface NavLinkItem extends BaseNavItem {}

export type ServiceNavItem = IconNavItem;
export interface SimpleNavItem extends BaseNavItem {}

export interface ProfileNavItem extends BaseNavItem {
  auth?: string;
  image?: string;
  alt?: string;
}

export type HeadersItem = {
  services: string;
  about: string;
  profile: string;
};

export interface NavbarConfig {
  headers?: HeadersItem;
  links?: NavLinkItem[];
  services?: ServiceNavItem[];
  about?: SimpleNavItem[];
  profile?: ProfileNavItem;
  register?: ProfileNavItem[];
}

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
}

export function NavbarView({
  profile,
  auth,
  navbarConfig,
  theme,
  deviceSize,
  menuOpen,
  onToggleMenu,
  onNavigate,
  onCloseMenu,
}: NavbarViewProps) {
  if (!profile) return null;

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      {deviceSize === 'desktop' && (
        <NavbarDesktopView
          profile={profile}
          auth={auth}
          navbarConfig={navbarConfig}
          theme={theme}
          onNavigate={onNavigate}
        />
      )}

      {deviceSize === 'tablet' && (
        <NavbarTabletView
          profile={profile}
          auth={auth}
          navbarConfig={navbarConfig}
          theme={theme}
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
          theme={theme}
          onNavigate={onNavigate}
        />
      )}
    </nav>
  );
}
