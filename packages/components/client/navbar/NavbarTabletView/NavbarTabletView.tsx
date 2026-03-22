'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarTabletView.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import { NavLinkItem, NavbarConfig } from '../NavbarView/NavbarView';

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

  const getLogoSrc = () => {
    return theme === 'dark' ? '/logos/nav-logo-dark.webp' : '/logos/nav-logo-light.webp';
  };

  const links: NavLinkItem[] = navbarConfig?.links ?? [
    { label: 'Cleaning', href: '/services/house-cleaning' },
    { label: 'Maintenance', href: '/services/home-service' },
    { label: 'How it works', href: '/how-it-work' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
  ];

  const avatarTexts = texts?.components?.client?.avatar;
  const navbarTexts = texts?.components?.client?.navbar;
  const profileNavTexts = texts?.pages?.client?.user?.profileNav;
  const profileLabel = avatarTexts?.profile?.label ?? navbarTexts?.profile?.label ?? 'Profile';
  const profileAria = avatarTexts?.profile?.ariaLabel ?? profileLabel;
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';
  const editLabel = texts?.pages?.client?.user?.edit?.title ?? 'Edit';

  const userLinks: NavLinkItem[] = auth.isLogged
    ? [
        { label: profileNavTexts?.profile ?? 'Profile', href: '/profile' },
        { label: profileNavTexts?.requests ?? 'Requests', href: '/profile/requests' },
        {
          label: profileNavTexts?.notifications ?? 'Notifications',
          href: '/profile/notification',
        },
        { label: profileNavTexts?.settings ?? 'Settings', href: '/profile/edit' },
      ]
    : [
        { label: registerLabel, href: '/user/register' },
        { label: loginLabel, href: '/user/login' },
      ];

  const activePanel: 'menu' | 'user' | null = menuOpen ? 'menu' : userMenuOpen ? 'user' : null;

  const handleToggleUserMenu = () => {
    if (menuOpen) {
      onCloseMenu();
    }
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <>
      <div className={styles.tabletLayout}>
        <header className={styles.tabletHeader}>
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

          <aside className={styles.tabletActions}>
            <div className={styles.tabletActionsGroup}>
              <ThemeToggler />
              <LanguageSwitcher />
              <button
                type="button"
                className={`${styles.profileButton} ${userMenuOpen ? styles.profileButtonOpen : ''}`}
                aria-label={profileAria}
                aria-expanded={userMenuOpen}
                aria-controls="tablet-user-navigation"
                onClick={handleToggleUserMenu}
              >
                <CgProfile />
              </button>
            </div>
          </aside>
          <button
            type="button"
            className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
          <div className={styles.imageWrapper}>
            {activePanel === 'menu' && (
              <Image
                className={styles.tabletImage}
                src={'/images/berlin.webp'}
                alt="Berlin"
                width={500}
                height={350}
                priority
              />
            )}
            <section className={styles.tabletSection}>
              <div
                className={styles.tabletLists}
                id={activePanel === 'menu' ? 'tablet-navigation' : 'tablet-user-navigation'}
              >
                <ul className={styles.tabletList}>
                  {(activePanel === 'menu' ? links : userLinks).map((item) => (
                    <li key={item.href} className={styles.tabletItem}>
                      <button
                        type="button"
                        className={styles.navLink}
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
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}
