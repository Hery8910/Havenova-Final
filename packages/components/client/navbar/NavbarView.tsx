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
      return isMobile ? '/favicon-dark.svg' : '/images/logos/nav-logo-dark.webp';
    } else {
      return isMobile ? '/favicon-light.svg' : '/images/logos/nav-logo-light.webp';
    }
  };

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.desktop}>
        <Link className={styles.logo} href="/" aria-label="Homepage">
          <Image
            className={styles.desktopLogo}
            src={getLogoSrc()}
            alt="Havenova Logo"
            width={isMobile ? 40 : 200}
            height={isMobile ? 40 : 50}
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
      {/* <div className={`${styles.wrapper} ${menuOpen ? styles.open : styles.close}`}>
        <ul
          id="navbar-sections"
          role="menubar"
          onMouseLeave={onCloseMenu}
          className={styles.nav_main}
        >
          <li className={styles.main_li} role="none">
            <h3 className={styles.h3}>{navbarConfig?.headers?.services}</h3>
            <ul className={styles.li_ul} role="menu" aria-label="Services">
              {navbarConfig?.services.map((link) => (
                <li className={styles.li} role="none" key={link.label}>
                  <button
                    role="menuitem"
                    onClick={() => onNavigate(link.href)}
                    className={styles.item}
                  >
                    {link.image && (
                      <Image
                        className={styles.image}
                        src={link.image}
                        alt={link.alt || link.label}
                        width={35}
                        height={35}
                        priority
                      />
                    )}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          <li className={styles.main_li} role="none">
            <h3 className={styles.h3}>{navbarConfig?.headers?.about}</h3>
            <ul className={styles.li_ul} role="menu" aria-label="About">
              {navbarConfig?.about.map((link) => (
                <li className={styles.li} role="none" key={link.label}>
                  <button
                    role="menuitem"
                    onClick={() => onNavigate(link.href)}
                    className={styles.item}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          <li className={styles.main_li} role="none">
            <h3 className={styles.h3}>{navbarConfig?.headers?.profile}</h3>
            <ul className={styles.li_ul} role="menu" aria-label="Profile">
              {isMobile && (
                <li key="prefer" className={styles.li} role="none">
                  <div role="menuitem" className={styles.item}>
                    <ThemeToggler />
                    <LanguageSwitcher />
                  </div>
                </li>
              )}
              {auth?.role === 'guest' ? (
                navbarConfig?.register.map((link) => (
                  <li className={styles.li} role="none" key={link.label}>
                    <button
                      role="menuitem"
                      onClick={() => onNavigate(link.href)}
                      className={styles.item}
                    >
                      {link.label}
                    </button>
                  </li>
                ))
              ) : (
                <li role="none">
                  <div role="menuitem">
                    <AvatarView />
                  </div>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div> */}
    </nav>
  );
}
