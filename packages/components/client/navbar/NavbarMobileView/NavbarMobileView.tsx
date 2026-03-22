'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarMobileView.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import { NavLinkItem, NavbarConfig } from '../NavbarView/NavbarView';
import { CgMenuLeftAlt, CgProfile } from 'react-icons/cg';
import { IoIosSettings } from 'react-icons/io';
import { FiTool } from 'react-icons/fi';

type NavSection = 'menu' | 'auth' | 'services' | 'preferences' | null;

export interface NavbarMobileViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  theme: 'light' | 'dark';
  onNavigate: (href: string) => void;
}

export function NavbarMobileView({
  profile,
  auth,
  navbarConfig,
  theme,
  onNavigate,
}: NavbarMobileViewProps) {
  const { texts } = useI18n();
  const [activeSection, setActiveSection] = useState<NavSection>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const bottomBarRef = useRef<HTMLElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  if (!profile) return null;

  const menuLinks: NavLinkItem[] = navbarConfig?.links ?? [
    { label: 'How it works', href: '/how-it-work' },
    { label: 'Contact', href: '/contact' },
    { label: 'About', href: '/about' },
  ];

  const serviceLinks: NavLinkItem[] = navbarConfig?.services ?? [
    { label: 'Cleaning', href: '/services/house-cleaning' },
    { label: 'Maintenance', href: '/services/home-service' },
  ];

  const avatarTexts = texts?.components?.client?.avatar;
  const navbarTexts = texts?.components?.client?.navbar;
  const profileNavTexts = texts?.pages?.client?.user?.profileNav;
  const editThemeTexts = texts?.pages?.client?.user?.edit?.theme;
  const menuLabel = navbarConfig?.headers?.about ?? 'Menu';
  const servicesLabel = navbarConfig?.headers?.services ?? 'Services';
  const profileButtonLabel = auth?.isLogged ? profileNavTexts?.profile ?? 'Profile' : 'Account';
  const preferencesLabel = profileNavTexts?.settings ?? 'Preferences';
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';
  const editLabel = texts?.pages?.client?.user?.edit?.title ?? 'Edit';
  const themeLabel = editThemeTexts?.theme ?? 'Theme';
  const languageLabel = editThemeTexts?.lang ?? 'Language';

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

  const handleNavClick = (href: string) => {
    onNavigate(href);
    setActiveSection(null);
  };

  const toggleSection = (section: NavSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  useEffect(() => {
    if (!activeSection) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (panelRef.current?.contains(target) || bottomBarRef.current?.contains(target)) {
        return;
      }

      setActiveSection(null);
      setDragOffset(0);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSection(null);
        setDragOffset(0);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (!activeSection || event.touches.length !== 1) return;

    dragStartYRef.current = event.touches[0].clientY;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    const startY = dragStartYRef.current;

    if (!activeSection || startY === null || event.touches.length !== 1) return;
    if ((panelRef.current?.scrollTop ?? 0) > 0) return;

    const nextOffset = Math.max(0, event.touches[0].clientY - startY);

    if (nextOffset <= 0) return;

    isDraggingRef.current = true;
    setDragOffset(nextOffset);
  };

  const handleTouchEnd = () => {
    if (!activeSection) return;

    if (isDraggingRef.current && dragOffset > 100) {
      setActiveSection(null);
    }

    dragStartYRef.current = null;
    isDraggingRef.current = false;
    setDragOffset(0);
  };

  const panelStyle: CSSProperties = activeSection
    ? {
        transform: `translateY(${dragOffset}px)`,
        transition: dragOffset > 0 ? 'none' : undefined,
      }
    : {};

  return (
    <section className={styles.mobileNavContainer} aria-label="Mobile navigation">
      <aside
        ref={panelRef}
        className={`${styles.mobilePanel} ${activeSection ? styles.mobilePanelOpen : ''}`}
        aria-label={activeSection ? `${activeSection} menu` : 'Navigation menu'}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={panelStyle}
      >
        {activeSection === 'menu' && (
          <section className={styles.mobilePanelContent} aria-labelledby="mobile-menu-title">
            <h2 id="mobile-menu-title" className={styles.mobilePanelTitle}>
              {menuLabel}
            </h2>
            <ul className={styles.mobilePanelList}>
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={styles.mobilePanelLink}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === 'auth' && (
          <section className={styles.mobilePanelContent} aria-labelledby="mobile-account-title">
            <h2 id="mobile-account-title" className={styles.mobilePanelTitle}>
              {profileButtonLabel}
            </h2>
            <ul className={styles.mobilePanelList}>
              {userLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={styles.mobilePanelLink}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === 'services' && (
          <section className={styles.mobilePanelContent} aria-labelledby="mobile-services-title">
            <h2 id="mobile-services-title" className={styles.mobilePanelTitle}>
              {servicesLabel}
            </h2>
            <ul className={styles.mobilePanelList}>
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={styles.mobilePanelLink}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === 'preferences' && (
          <section
            className={styles.mobilePanelContent}
            aria-labelledby="mobile-preferences-title"
          >
            <h2 id="mobile-preferences-title" className={styles.mobilePanelTitle}>
              {preferencesLabel}
            </h2>
            <ul className={styles.mobilePanelPreferences}>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>{themeLabel}</span>
                <ThemeToggler />
              </li>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>{languageLabel}</span>
                <LanguageSwitcher />
              </li>
            </ul>
          </section>
        )}
      </aside>

      <nav
        ref={bottomBarRef}
        className={styles.mobileBottomBar}
        aria-label="Mobile navigation sections"
      >
        <ul className={styles.mobileBottomList}>
          <li>
            <button
              type="button"
              className={`${styles.mobileNavButton} ${activeSection === 'menu' ? styles.mobileNavButtonActive : ''}`}
              aria-label={menuLabel}
              aria-expanded={activeSection === 'menu'}
              onClick={() => toggleSection('menu')}
              title={menuLabel}
            >
              <CgMenuLeftAlt />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${styles.mobileNavButton} ${activeSection === 'services' ? styles.mobileNavButtonActive : ''}`}
              aria-label={servicesLabel}
              aria-expanded={activeSection === 'services'}
              onClick={() => toggleSection('services')}
              title={servicesLabel}
            >
              <FiTool />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${styles.mobileNavButton} ${activeSection === 'auth' ? styles.mobileNavButtonActive : ''}`}
              aria-label={profileButtonLabel}
              aria-expanded={activeSection === 'auth'}
              onClick={() => toggleSection('auth')}
              title={profileButtonLabel}
            >
              <CgProfile />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${styles.mobileNavButton} ${activeSection === 'preferences' ? styles.mobileNavButtonActive : ''}`}
              aria-label={preferencesLabel}
              aria-expanded={activeSection === 'preferences'}
              onClick={() => toggleSection('preferences')}
              title={preferencesLabel}
            >
              <IoIosSettings />
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
