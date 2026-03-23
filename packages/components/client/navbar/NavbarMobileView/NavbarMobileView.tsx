'use client';
import { useEffect, useRef, useState } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import { useI18n } from '../../../../contexts';
import styles from './NavbarMobileView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser, UserClientProfile } from '../../../../types';
import type { NavbarConfig } from '../navbar.types';
import { getNavbarContent } from '../navbar.shared';
import { CgMenuLeftAlt, CgProfile } from 'react-icons/cg';
import { IoIosSettings } from 'react-icons/io';
import { FiTool } from 'react-icons/fi';

type NavSection = 'menu' | 'auth' | 'services' | 'preferences' | null;

export interface NavbarMobileViewProps {
  profile: UserClientProfile;
  auth: AuthUser;
  navbarConfig?: NavbarConfig;
  onNavigate: (href: string) => void;
}

export function NavbarMobileView({
  profile,
  auth,
  navbarConfig,
  onNavigate,
}: NavbarMobileViewProps) {
  const { texts } = useI18n();
  const [activeSection, setActiveSection] = useState<NavSection>(null);
  const panelRef = useRef<HTMLElement>(null);
  const bottomBarRef = useRef<HTMLElement>(null);

  if (!profile) return null;

  const { menuLinks, serviceLinks, userLinks, labels, a11y } = getNavbarContent({
    texts,
    navbarConfig,
    auth,
  });
  const profileButtonLabel = auth.isLogged ? labels.profile : labels.account;

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
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveSection(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  const activePanelLabel =
    activeSection === 'menu'
      ? a11y.menuPanel
      : activeSection === 'auth'
        ? a11y.accountPanel
        : activeSection === 'services'
          ? a11y.servicesPanel
          : activeSection === 'preferences'
            ? a11y.preferencesPanel
            : a11y.mobileNavigation;

  return (
    <section className={styles.mobileNavContainer} aria-label={a11y.mobileNavigation}>
      <aside
        id="mobile-navigation-panel"
        ref={panelRef}
        className={`${styles.mobilePanel} ${sharedStyles.surfaceGlass} ${
          activeSection ? styles.mobilePanelOpen : ''
        }`}
        aria-label={activePanelLabel}
      >
        {activeSection === 'menu' && (
          <section className={styles.mobilePanelContent} aria-labelledby="mobile-menu-title">
            <span className={`${sharedStyles.panelHandle} ${styles.panelHandle}`} aria-hidden="true" />

            <h2 id="mobile-menu-title" className={`${sharedStyles.panelTitle} ${styles.mobilePanelTitle}`}>
              {labels.menu}
            </h2>
            <ul className={`${sharedStyles.panelList} ${styles.mobilePanelList}`}>
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink}`}
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
            <span className={`${sharedStyles.panelHandle} ${styles.panelHandle}`} aria-hidden="true" />

            <h2 id="mobile-account-title" className={`${sharedStyles.panelTitle} ${styles.mobilePanelTitle}`}>
              {profileButtonLabel}
            </h2>
            <ul className={`${sharedStyles.panelList} ${styles.mobilePanelList}`}>
              {userLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink}`}
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
            <span className={`${sharedStyles.panelHandle} ${styles.panelHandle}`} aria-hidden="true" />

            <h2
              id="mobile-services-title"
              className={`${sharedStyles.panelTitle} ${styles.mobilePanelTitle}`}
            >
              {labels.services}
            </h2>
            <ul className={`${sharedStyles.panelList} ${styles.mobilePanelList}`}>
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    className={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink}`}
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
          <section className={styles.mobilePanelContent} aria-labelledby="mobile-preferences-title">
            <span className={`${sharedStyles.panelHandle} ${styles.panelHandle}`} aria-hidden="true" />

            <h2
              id="mobile-preferences-title"
              className={`${sharedStyles.panelTitle} ${styles.mobilePanelTitle}`}
            >
              {labels.preferences}
            </h2>
            <ul className={`${sharedStyles.panelList} ${styles.mobilePanelList}`}>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>{labels.theme}</span>
                <ThemeToggler />
              </li>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>{labels.language}</span>
                <LanguageSwitcher />
              </li>
            </ul>
          </section>
        )}
      </aside>

      <nav
        ref={bottomBarRef}
        className={`${styles.mobileBottomBar} ${sharedStyles.surfaceGlass}`}
        aria-label={a11y.mobileNavigationSections}
      >
        <ul className={styles.mobileBottomList}>
          <li>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'menu'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.menuToggle}
              aria-expanded={activeSection === 'menu'}
              aria-controls="mobile-navigation-panel"
              onClick={() => toggleSection('menu')}
            >
              <CgMenuLeftAlt />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'services'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.servicesToggle}
              aria-expanded={activeSection === 'services'}
              aria-controls="mobile-navigation-panel"
              onClick={() => toggleSection('services')}
            >
              <FiTool />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'auth'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.profileToggle}
              aria-expanded={activeSection === 'auth'}
              aria-controls="mobile-navigation-panel"
              onClick={() => toggleSection('auth')}
            >
              <CgProfile />
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'preferences'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.preferencesToggle}
              aria-expanded={activeSection === 'preferences'}
              aria-controls="mobile-navigation-panel"
              onClick={() => toggleSection('preferences')}
            >
              <IoIosSettings />
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
