'use client';
import { useCallback, useId, useRef, useState } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import styles from './NavbarMobileView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser } from '../../../../types';
import type { ResolvedNavbarContent } from '../navbar.shared';
import { CgProfile } from 'react-icons/cg';
import { IoIosSettings } from 'react-icons/io';
import { FiTool } from 'react-icons/fi';
import { NavbarAccountContent } from '../components/NavbarAccountContent';
import { HiMiniLanguage } from 'react-icons/hi2';
import Image from 'next/image';
import { NavbarLinkList } from '../components/NavbarLinkList';
import { NavbarPanelSection } from '../components/NavbarPanelSection';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';

type NavSection = 'menu' | 'auth' | 'services' | 'preferences' | null;

export interface NavbarMobileViewProps {
  auth: AuthUser;
  content: ResolvedNavbarContent;
  onNavigate: (href: string) => void;
  onLogout: () => Promise<void>;
  bellSlot?: (() => JSX.Element) | null;
}

export function NavbarMobileView({
  auth,
  content,
  onNavigate,
  onLogout,
  bellSlot,
}: NavbarMobileViewProps) {
  const [activeSection, setActiveSection] = useState<NavSection>(null);
  const panelRef = useRef<HTMLElement>(null);
  const bottomBarRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const accountTitleId = useId();
  const menuTitleId = useId();
  const servicesTitleId = useId();
  const preferencesTitleId = useId();
  const { branding, menuLinks, serviceLinks, userLinks, labels, preferences, session, a11y } =
    content;
  const BellSlot = bellSlot;
  const profileButtonLabel = auth.isLogged ? labels.profile : labels.account;
  const closeActiveSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleNavClick = (href: string) => {
    onNavigate(href);
    closeActiveSection();
  };

  const toggleSection = (section: NavSection) => {
    setActiveSection(activeSection === section ? null : section);
  };

  useDismissibleLayer({
    enabled: Boolean(activeSection),
    refs: [panelRef, bottomBarRef],
    onDismiss: closeActiveSection,
  });

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
  const activePanelTitleId =
    activeSection === 'menu'
      ? menuTitleId
      : activeSection === 'auth'
        ? accountTitleId
        : activeSection === 'services'
          ? servicesTitleId
          : activeSection === 'preferences'
            ? preferencesTitleId
            : undefined;

  return (
    <section className={styles.mobileNavContainer} aria-label={a11y.mobileNavigation}>
      <aside
        id={panelId}
        ref={panelRef}
        className={`${styles.mobilePanel} glass-panel--base ${
          activeSection ? styles.mobilePanelOpen : ''
        }`}
        aria-label={activePanelTitleId ? undefined : activePanelLabel}
        aria-labelledby={activePanelTitleId}
      >
        {activeSection === 'auth' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={profileButtonLabel}
            titleId={accountTitleId}
            headerClassName={styles.mobilePanelHeader}
            titleClassName={styles.mobilePanelTitle}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <NavbarAccountContent
              authIsLogged={session.isLoggedIn}
              userLinks={userLinks}
              logoutLabel={session.logoutLabel}
              onItemClick={handleNavClick}
              onLogoutClick={() => {
                closeActiveSection();
                void onLogout();
              }}
              bellSlot={BellSlot}
              listClassName={`${sharedStyles.panelList} ${styles.mobilePanelList}`}
              buttonClassName={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink} ${styles.mobilePanelLinkWithIcon}`}
              iconClassName={styles.mobilePanelIcon}
              featureListClassName={`${sharedStyles.panelList} ${styles.mobilePanelList}`}
              featureItemClassName={styles.mobilePanelFeature}
            />
          </NavbarPanelSection>
        )}

        {activeSection === 'menu' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.menu}
            titleId={menuTitleId}
            headerClassName={styles.mobilePanelHeader}
            titleClassName={styles.mobilePanelTitle}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <NavbarLinkList
              items={menuLinks}
              onItemClick={handleNavClick}
              listClassName={`${sharedStyles.panelList} ${styles.mobilePanelList}`}
              buttonClassName={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink} ${styles.mobilePanelLinkWithIcon}`}
              iconClassName={styles.mobilePanelIcon}
            />
          </NavbarPanelSection>
        )}
        {activeSection === 'services' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.services}
            titleId={servicesTitleId}
            headerClassName={styles.mobilePanelHeader}
            titleClassName={styles.mobilePanelTitle}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <NavbarLinkList
              items={serviceLinks}
              onItemClick={handleNavClick}
              listClassName={`${sharedStyles.panelList} ${styles.mobilePanelList}`}
              buttonClassName={`${sharedStyles.navLinkButton} ${styles.mobilePanelLink} ${styles.mobilePanelLinkWithIcon}`}
              imageClassName={styles.mobilePanelImage}
            />
          </NavbarPanelSection>
        )}

        {activeSection === 'preferences' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.preferences}
            titleId={preferencesTitleId}
            headerClassName={styles.mobilePanelHeader}
            titleClassName={styles.mobilePanelTitle}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <ul className={`${sharedStyles.panelList} ${styles.mobilePanelList}`}>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>
                  <span>{preferences.theme}</span>
                </span>
                <ThemeToggler display="icon-with-value" labels={preferences.themeToggle} />
              </li>
              <li className={styles.preferencesItem}>
                <span className={styles.preferencesLabel}>
                  <span>{preferences.language}</span>
                </span>
                <LanguageSwitcher
                  presentation="modal"
                  triggerDisplay="icon-with-value"
                  labels={preferences.languageSwitcher}
                />
              </li>
            </ul>
          </NavbarPanelSection>
        )}
      </aside>

      <nav
        ref={bottomBarRef}
        className={` glass-panel--base ${styles.mobileBottomBar}`}
        aria-label={a11y.mobileNavigationSections}
      >
        <ul className={styles.mobileBottomList}>
          <li className={styles.mobileBottomItem}>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'menu'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.menuToggle}
              aria-expanded={activeSection === 'menu'}
              aria-controls={panelId}
              onClick={() => toggleSection('menu')}
            >
              <Image
                className={styles.bottomBarLogo}
                src={branding.mobileLogoSrc}
                alt={a11y.logoAlt}
                width={branding.mobileLogoWidth}
                height={branding.mobileLogoHeight}
                priority
              />
              <span className={styles.srOnly}>{labels.menu}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'services'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.servicesToggle}
              aria-expanded={activeSection === 'services'}
              aria-controls={panelId}
              onClick={() => toggleSection('services')}
            >
              <FiTool />
              <span className={styles.srOnly}>{labels.services}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'auth'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.profileToggle}
              aria-expanded={activeSection === 'auth'}
              aria-controls={panelId}
              onClick={() => toggleSection('auth')}
            >
              <CgProfile />
              <span className={styles.srOnly}>{profileButtonLabel}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              type="button"
              className={`${sharedStyles.iconButton} ${styles.mobileNavButton} ${
                activeSection === 'preferences'
                  ? `${sharedStyles.iconButtonActive} ${styles.mobileNavButtonActive}`
                  : ''
              }`}
              aria-label={a11y.preferencesToggle}
              aria-expanded={activeSection === 'preferences'}
              aria-controls={panelId}
              onClick={() => toggleSection('preferences')}
            >
              <IoIosSettings />
              <span className={styles.srOnly}>{labels.preferences}</span>
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
