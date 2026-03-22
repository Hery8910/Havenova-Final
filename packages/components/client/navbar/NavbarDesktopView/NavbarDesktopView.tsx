'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarDesktopView.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import { NavLinkItem, NavbarConfig } from '../NavbarView/NavbarView';

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

  return (
    <div className={styles.desktopShell}>
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
          <ThemeToggler />
          <LanguageSwitcher />
          <button
            type="button"
            className={`${styles.profileButton} ${userMenuOpen ? styles.profileButtonOpen : ''}`}
            aria-label={profileAria}
            aria-expanded={userMenuOpen}
            aria-controls="desktop-user-navigation"
            onClick={() => setUserMenuOpen((prev) => !prev)}
          >
            <CgProfile />
          </button>
        </aside>
      </div>
      {userMenuOpen && (
        <div className={styles.desktopDropdown}>
          <div className={styles.desktopDropdownInner}>
            <ul id="desktop-user-navigation" className={styles.userList}>
              {userLinks.map((item) => (
                <li key={item.href} className={styles.userItem}>
                  <button
                    type="button"
                    className={styles.navLink}
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
        </div>
      )}
    </div>
  );
}
