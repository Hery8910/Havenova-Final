import Link from 'next/link';
import Image from 'next/image';
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
      return '/logos/nav-logo-dark.webp';
    } else {
      return '/logos/nav-logo-light.webp';
    }
  };

  const links: NavLinkItem[] = navbarConfig?.links ?? [
    { label: 'Cleaning', href: '/services/house-cleaning' },
    { label: 'Maintenance', href: '/services/home-service' },
    { label: 'How it works', href: '/how-it-work' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      {!isMobile ? (
        <div className={styles.desktopLayout}>
          <Link className={styles.logoLink} href="/" aria-label="Homepage">
            <Image
              className={styles.logoImage}
              src={getLogoSrc()}
              alt="Havenova Logo"
              width={170}
              height={40}
              priority
            />
          </Link>
          <ul className={styles.navList}>
            {links.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <button
                  type="button"
                  className={styles.navLink}
                  onClick={() => onNavigate(item.href)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <aside className={styles.navActions}>
            {!isMobile && (
              <>
                <ThemeToggler />
                <LanguageSwitcher />
                <AvatarView isMobile={isMobile} />
              </>
            )}
          </aside>
        </div>
      ) : (
        <div className={styles.mobileLayout}>
          <header className={styles.mobileHeader}>
            <Link className={styles.logoLink} href="/" aria-label="Homepage">
              <Image
                className={styles.logoImage}
                src={getLogoSrc()}
                alt="Havenova Logo"
                width={170}
                height={40}
                priority
              />
            </Link>
            <button
              type="button"
              className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={onToggleMenu}
            >
              <span className={styles.menuLine} aria-hidden="true" />
              <span className={styles.menuLine} aria-hidden="true" />
            </button>
          </header>
          {menuOpen && (
            <div className={styles.imageWrapper}>
              <Image
                className={styles.tabletImage}
                src={'/images/berlin.webp'}
                alt="Berlin"
                width={600}
                height={400}
                priority
              />
              <section className={styles.mobileSection}>
                <aside className={styles.mobileActions}>
                  <div className={styles.mobileActionsGroup}>
                    <ThemeToggler />
                    <LanguageSwitcher />
                  </div>
                  <AvatarView isMobile={isMobile} />
                </aside>
                <div className={styles.mobileLists} id="mobile-navigation">
                  <ul className={styles.mobileList}>
                    {links.map((item) => (
                      <li key={item.href} className={styles.mobileItem}>
                        <button
                          type="button"
                          className={styles.navLink}
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
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
