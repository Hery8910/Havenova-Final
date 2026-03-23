'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarTabletView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import type { NavbarConfig } from '../navbar.types';
import { getNavbarContent, getNavbarLogoSrc } from '../navbar.shared';

export interface NavbarTabletViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (href: string) => void;
  onCloseMenu: () => void;
}

export function NavbarTabletView({
  profile,
  auth,
  navbarConfig,
  theme,
  menuOpen,
  onToggleMenu,
  onNavigate,
  onCloseMenu,
}: NavbarTabletViewProps) {
  const { texts } = useI18n();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!profile) return null;

  const { primaryLinks, userLinks, labels, a11y } = getNavbarContent({
    texts,
    navbarConfig,
    auth,
  });

  const activePanel: 'menu' | 'user' | null = menuOpen ? 'menu' : userMenuOpen ? 'user' : null;

  const handleToggleUserMenu = () => {
    if (menuOpen) {
      onCloseMenu();
    }
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <section className={`${styles.tabletLayout} ${sharedStyles.surfaceGlass}`}>
      <header className={styles.tabletHeader}>
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

        <section className={styles.tabletActions} aria-label={labels.preferences}>
          <div className={styles.tabletActionsGroup}>
            <ThemeToggler />
            <LanguageSwitcher />
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.profileButton} ${
                userMenuOpen ? `${sharedStyles.iconButtonActive} ${styles.profileButtonOpen}` : ''
              }`}
              aria-label={a11y.profileToggle}
              aria-expanded={userMenuOpen}
              aria-controls="tablet-user-navigation"
              onClick={handleToggleUserMenu}
            >
              <CgProfile />
            </button>
          </div>
        </section>
        <button
          type="button"
          className={`${sharedStyles.menuButton} ${styles.menuButton} ${
            menuOpen ? styles.menuButtonOpen : ''
          }`}
          aria-label={menuOpen ? a11y.closeMenu : a11y.openMenu}
          aria-expanded={menuOpen}
          aria-controls="tablet-navigation"
          onClick={() => {
            setUserMenuOpen(false);
            onToggleMenu();
          }}
        >
          <span className={styles.menuLine} aria-hidden="true" />
          <span className={styles.menuLine} aria-hidden="true" />
        </button>
      </header>
      {activePanel && (
        <section
          className={styles.imageWrapper}
          aria-label={activePanel === 'menu' ? a11y.menuPanel : a11y.accountPanel}
        >
          {activePanel === 'menu' && (
            <Image
              className={styles.tabletImage}
              src="/images/berlin.webp"
              alt="Berlin"
              width={500}
              height={350}
              priority
            />
          )}
          <section className={styles.tabletSection}>
            <nav
              className={styles.tabletLists}
              id={activePanel === 'menu' ? 'tablet-navigation' : 'tablet-user-navigation'}
              aria-label={activePanel === 'menu' ? a11y.menuPanel : a11y.accountPanel}
            >
              <ul className={styles.tabletList}>
                {(activePanel === 'menu' ? primaryLinks : userLinks).map((item) => (
                  <li key={item.href} className={styles.tabletItem}>
                    <button
                      type="button"
                      className={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                      onClick={() => {
                        onNavigate(item.href);
                        if (activePanel === 'menu') {
                          onCloseMenu();
                        } else {
                          setUserMenuOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </section>
      )}
    </section>
  );
}
