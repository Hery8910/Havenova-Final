import Link from 'next/link';
import Image from 'next/image';
import { HiMenuAlt3 } from 'react-icons/hi';
import ThemeToggler from '../themeToggler/ThemeToggler';
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';
import { AvatarContainer } from '../user';

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
export type ProfileAuth = 'guest' | 'user' | 'admin';

export interface ProfileNavItem extends IconNavItem {
  auth: ProfileAuth;
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
  user: { role: ProfileAuth; theme: 'light' | 'dark' } | null;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  isMobile: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (href: string) => void;
  onCloseMenu: () => void;
}

export function NavbarView({
  user,
  navbarConfig,
  theme,
  isMobile,
  menuOpen,
  onToggleMenu,
  onNavigate,
  onCloseMenu,
}: NavbarViewProps) {
  if (!user) return null;

  const getLogoSrc = () => {
    if (theme === 'dark') {
      return isMobile ? '/images/logos/logo-small-dark.webp' : '/images/logos/logo-dark.webp';
    } else {
      return isMobile ? '/images/logos/logo-small-light.webp' : '/images/logos/logo-light.webp';
    }
  };

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <header className={styles.nav_header}>
        <Link className={styles.logo} href="/" aria-label="Homepage">
          <Image
            className={styles.logo}
            src={getLogoSrc()}
            alt="Havenova Logo"
            width={isMobile ? 40 : 200}
            height={isMobile ? 40 : 50}
            priority
          />
        </Link>
        <aside className={styles.nav_aside}>
          {!isMobile && (
            <>
              <ThemeToggler />
              <LanguageSwitcher />
            </>
          )}
          <button
            onClick={onToggleMenu}
            className={styles.icon}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="navbar-sections"
          >
            <HiMenuAlt3 />
          </button>
        </aside>
      </header>
      <article className={`${styles.wrapper} ${menuOpen ? styles.open : styles.close}`}>
        <ul
          id="navbar-sections"
          role="menubar"
          onMouseLeave={onCloseMenu}
          className={styles.nav_main}
        >
          {/* Services */}
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

          {/* About */}
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

          {/* Profile */}
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
              {user?.role === 'guest' ? (
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
                    <AvatarContainer />
                  </div>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </article>
    </nav>
  );
}
