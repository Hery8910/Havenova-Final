'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarDesktopView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import type { NavbarConfig } from '../navbar.types';
import { getNavbarContent, getNavbarLogoSrc } from '../navbar.shared';

export interface NavbarDesktopViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  onNavigate: (href: string) => void;
}

export function NavbarDesktopView({
  profile,
  auth,
  navbarConfig,
  theme,
  onNavigate,
}: NavbarDesktopViewProps) {
  const { texts } = useI18n();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!profile) return null;

  const { primaryLinks, userLinks, labels, a11y } = getNavbarContent({
    texts,
    navbarConfig,
    auth,
  });

  return (
    <section className={styles.desktopShell}>
      <header className={styles.desktopLayout}>
        <Link className={styles.logoLink} href="/" aria-label={a11y.homeLink}>
          <Image
            className={styles.logoImage}
            src={getNavbarLogoSrc(theme)}
            alt={a11y.logoAlt}
            width={170}
            height={40}
            priority
          />
        </Link>
        <ul className={styles.navList}>
          {primaryLinks.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <button
                type="button"
                className={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                onClick={() => onNavigate(item.href)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <section className={styles.navActions} aria-label={labels.preferences}>
          <ThemeToggler />
          <LanguageSwitcher />
          <button
            type="button"
            className={`${sharedStyles.iconButton} ${styles.profileButton} ${
              userMenuOpen ? `${sharedStyles.iconButtonActive} ${styles.profileButtonOpen}` : ''
            }`}
            aria-label={a11y.profileToggle}
            aria-expanded={userMenuOpen}
            aria-controls="desktop-user-navigation"
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <CgProfile />
          </button>
        </section>
      </header>
      {userMenuOpen && (
        <section className={styles.desktopDropdown} aria-label={a11y.accountPanel}>
          <div className={styles.desktopDropdownInner}>
            <ul id="desktop-user-navigation" className={styles.userList}>
              {userLinks.map((item) => (
                <li key={item.href} className={styles.userItem}>
                  <button
                    type="button"
                    className={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate(item.href);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </section>
  );
}
