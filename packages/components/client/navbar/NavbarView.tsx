import Link from 'next/link';
import Image from 'next/image';
import { HiMenuAlt3 } from 'react-icons/hi';
import ThemeToggler from '../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';
import { AuthUser, UserClientProfile } from '../../../types';
import { AvatarView } from '../../user';

// Tipos base
export interface BaseNavItem {
  label: string;
  href: string;
}

export interface IconNavItem extends BaseNavItem {
  image: string;
  alt: string;
}

export type ServiceNavItem = IconNavItem;
export interface SimpleNavItem extends BaseNavItem {}

export interface ProfileNavItem extends IconNavItem {
  auth: string;
}

export type HeadersItem = {
  services: string;
  about: string;
  profile: string;
};

export interface NavbarConfig {
  headers: HeadersItem;
  services: ServiceNavItem[];
  about: SimpleNavItem[];
  profile: ProfileNavItem;
  register: ProfileNavItem[];
}

export interface NavbarViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  isMobile: boolean;
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
  isMobile,
  menuOpen,
  onToggleMenu,
  onNavigate,
  onCloseMenu,
}: NavbarViewProps) {
  if (!profile) return null;

  const getLogoSrc = () => {
    if (theme === 'dark') {
      return '/images/logos/nav-logo-dark.webp';
    } else {
      return '/images/logos/nav-logo-light.webp';
    }
  };

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {!isMobile ? (
        <div className={styles.desktop}>
          <Link className={styles.logo} href="/" aria-label="Homepage">
            <Image
              className={styles.desktopLogo}
              src={getLogoSrc()}
              alt="Havenova Logo"
              width={200}
              height={50}
              priority
            />
          </Link>
          <ul className={styles.desktopUl}>
            <li className={styles.desktopLi}>How it works</li>
            <li className={styles.desktopLi}>Cleaning</li>
            <li className={styles.desktopLi}>Wartung</li>
            <li className={styles.desktopLi}>Contact</li>
            <li className={styles.desktopLi}>About</li>
          </ul>
          <aside className={styles.desktopAside}>
            {!isMobile && (
              <>
                <ThemeToggler />
                <LanguageSwitcher />
                <AvatarView />
              </>
            )}
          </aside>
        </div>
      ) : (
        <div className={styles.mobile}>
          <header className={styles.header}>
            <Link className={styles.logo} href="/" aria-label="Homepage">
              <Image
                className={styles.mobileLogo}
                src={getLogoSrc()}
                alt="Havenova Logo"
                width={200}
                height={50}
                priority
              />
            </Link>
            <button className={styles.button} onClick={onToggleMenu}>
              <HiMenuAlt3 />
            </button>
          </header>
          {menuOpen && (
            <>
              <aside className={styles.mobileAside}>
                <div className={styles.asideDiv}>
                  <ThemeToggler />
                  <LanguageSwitcher />
                </div>
                <AvatarView />
              </aside>
              <ul className={styles.mobileUl}>
                <li className={styles.mobileLi}>Cleaning</li>
                <li className={styles.mobileLi}>Wartung</li>
                <li className={styles.mobileLi}>How it works</li>
                <li className={styles.mobileLi}>Contact</li>
                <li className={styles.mobileLi}>About</li>
              </ul>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
