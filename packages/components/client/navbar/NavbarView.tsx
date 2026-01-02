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

export interface NavLinkItem extends BaseNavItem {
  tone?: 'cleaning' | 'maintenance' | string;
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
  links?: NavLinkItem[];
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

  const links: NavLinkItem[] = navbarConfig?.links ?? [
    { label: 'Cleaning', href: '/services/house-cleaning', tone: 'cleaning' },
    { label: 'Maintenance', href: '/services/home-service', tone: 'maintenance' },
    { label: 'How it works', href: '/how-it-work' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
  ];

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
            {links.map((item) => (
              <li key={item.href} className={styles.desktopLi}>
                <button
                  type="button"
                  className={`${styles.linkButton} ${item.tone ? styles[`tone_${item.tone}`] : ''}`}
                  onClick={() => onNavigate(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))}
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
                {links.map((item) => (
                  <li key={item.href} className={styles.mobileLi}>
                    <button
                      type="button"
                      className={`${styles.linkButton} ${
                        item.tone ? styles[`tone_${item.tone}`] : ''
                      }`}
                      onClick={() => {
                        onNavigate(item.href);
                        onCloseMenu();
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
