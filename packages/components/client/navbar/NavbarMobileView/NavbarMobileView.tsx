'use client';
import { useId, useRef } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import styles from './NavbarMobileView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser } from '../../../../types';
import type { ResolvedNavbarContent } from '../navbar.shared';
import { IoIosSettings } from 'react-icons/io';
import { FiTool } from 'react-icons/fi';
import { NavbarAccountContent } from '../components/NavbarAccountContent';
import Image from 'next/image';
import { NavbarLinkList } from '../components/NavbarLinkList';
import { NavbarPanelSection } from '../components/NavbarPanelSection';
import { NavbarProfileTrigger } from '../components/NavbarProfileTrigger';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';
import { useNavbarPanelState } from '../hooks/useNavbarPanelState';
import { IoClose } from 'react-icons/io5';
import { useFocusTrap } from '../../../../utils/accessibility/useFocusTrap';

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
  const panelRef = useRef<HTMLElement>(null);
  const bottomBarRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const authTriggerRef = useRef<HTMLButtonElement>(null);
  const preferencesTriggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const accountTitleId = useId();
  const menuTitleId = useId();
  const servicesTitleId = useId();
  const preferencesTitleId = useId();
  const { branding, menuLinks, serviceLinks, userLinks, labels, preferences, session, a11y } =
    content;
  const BellSlot = bellSlot;
  const profileButtonLabel = auth.isLogged ? labels.profile : labels.account;
  const {
    activePanel: activeSection,
    visiblePanel: visibleSection,
    isAnyPanelOpen: isPanelOpen,
    closePanel: closeActiveSection,
    togglePanel: toggleSection,
    handlePanelTransitionEnd,
  } = useNavbarPanelState<Exclude<NavSection, null>>({
    persistOnClose: true,
  });
  const isSectionOpen = (section: Exclude<NavSection, null>) => activeSection === section;

  const handleNavClick = (href: string) => {
    onNavigate(href);
    closeActiveSection();
  };

  useDismissibleLayer({
    enabled: Boolean(activeSection),
    refs: [panelRef, bottomBarRef],
    onDismiss: closeActiveSection,
  });

  useFocusTrap({
    enabled: Boolean(activeSection),
    containerRef: panelRef,
    returnFocusRef:
      activeSection === 'menu'
        ? menuTriggerRef
        : activeSection === 'services'
          ? servicesTriggerRef
          : activeSection === 'auth'
            ? authTriggerRef
            : preferencesTriggerRef,
    onEscape: closeActiveSection,
  });
  const activePanelLabel =
    visibleSection === 'menu'
      ? a11y.menuPanel
      : visibleSection === 'auth'
        ? a11y.accountPanel
        : visibleSection === 'services'
          ? a11y.servicesPanel
          : visibleSection === 'preferences'
            ? a11y.preferencesPanel
            : a11y.mobileNavigation;
  const activePanelTitleId =
    visibleSection === 'menu'
      ? menuTitleId
      : visibleSection === 'auth'
        ? accountTitleId
        : visibleSection === 'services'
          ? servicesTitleId
          : visibleSection === 'preferences'
            ? preferencesTitleId
            : undefined;
  const mobilePanelCloseButton = (
    <button
      type="button"
      className={`button button--close ${styles.mobilePanelCloseButton}`}
      aria-label={a11y.closeMenu}
      onClick={closeActiveSection}
    >
      <IoClose />
    </button>
  );

  return (
    <section className={styles.mobileNavContainer} aria-label={a11y.mobileNavigation}>
      <aside
        id={panelId}
        ref={panelRef}
        className={`${styles.mobilePanel} card card--neutral ${
          isPanelOpen ? styles.mobilePanelOpen : ''
        }`}
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-label={activePanelTitleId ? undefined : activePanelLabel}
        aria-labelledby={activePanelTitleId}
        aria-hidden={!visibleSection}
        onTransitionEnd={handlePanelTransitionEnd}
      >
        {visibleSection === 'auth' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={session.displayName ?? profileButtonLabel}
            titleId={accountTitleId}
            headerClassName={`${sharedStyles.panelHeader} ${styles.mobilePanelHeader}`}
            titleClassName={`${styles.mobilePanelTitle} ${sharedStyles.panelIdentityTitle}`}
            headerAction={mobilePanelCloseButton}
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
              animated
            />
          </NavbarPanelSection>
        )}

        {visibleSection === 'menu' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.menu}
            titleId={menuTitleId}
            headerClassName={`${sharedStyles.panelHeader} ${styles.mobilePanelHeader}`}
            titleClassName={styles.mobilePanelTitle}
            headerAction={mobilePanelCloseButton}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <NavbarLinkList items={menuLinks} onItemClick={handleNavClick} animated />
          </NavbarPanelSection>
        )}
        {visibleSection === 'services' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.services}
            titleId={servicesTitleId}
            headerClassName={`${sharedStyles.panelHeader} ${styles.mobilePanelHeader}`}
            titleClassName={styles.mobilePanelTitle}
            headerAction={mobilePanelCloseButton}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <NavbarLinkList items={serviceLinks} onItemClick={handleNavClick} animated />
          </NavbarPanelSection>
        )}

        {visibleSection === 'preferences' && (
          <NavbarPanelSection
            className={styles.mobilePanelContent}
            title={labels.preferences}
            titleId={preferencesTitleId}
            headerClassName={`${sharedStyles.panelHeader} ${styles.mobilePanelHeader}`}
            titleClassName={styles.mobilePanelTitle}
            headerAction={mobilePanelCloseButton}
            showHandle
            handleClassName={styles.panelHandle}
          >
            <ul className={`${sharedStyles.panelList} ${styles.mobilePreferencesList}`}>
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
                  panelVariant="navbar"
                  labels={preferences.languageSwitcher}
                />
              </li>
            </ul>
          </NavbarPanelSection>
        )}
      </aside>

      <nav
        ref={bottomBarRef}
        className={`card card--neutral ${styles.mobileBottomBar}`}
        aria-label={a11y.mobileNavigationSections}
      >
        <ul className={styles.mobileBottomList}>
          <li className={styles.mobileBottomItem}>
            <button
              ref={menuTriggerRef}
              type="button"
              className={`button button--ghost ${sharedStyles.iconButton} ${styles.mobileNavButton}`}
              aria-label={isSectionOpen('menu') ? a11y.closeMenu : a11y.menuToggle}
              aria-expanded={isSectionOpen('menu')}
              aria-controls={panelId}
              aria-haspopup="dialog"
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
              <span className={sharedStyles.srOnly}>{labels.menu}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              ref={servicesTriggerRef}
              type="button"
              className={`button button--ghost ${sharedStyles.iconButton} ${styles.mobileNavButton}`}
              aria-label={isSectionOpen('services') ? a11y.closeMenu : a11y.servicesToggle}
              aria-expanded={isSectionOpen('services')}
              aria-controls={panelId}
              aria-haspopup="dialog"
              onClick={() => toggleSection('services')}
            >
              <FiTool />
              <span className={sharedStyles.srOnly}>{labels.services}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              ref={authTriggerRef}
              type="button"
              className={`button button--ghost ${sharedStyles.iconButton} ${styles.mobileNavButton}`}
              aria-label={isSectionOpen('auth') ? a11y.closeMenu : a11y.profileToggle}
              aria-expanded={isSectionOpen('auth')}
              aria-controls={panelId}
              aria-haspopup="dialog"
              onClick={() => toggleSection('auth')}
            >
              <NavbarProfileTrigger
                avatarSrc={session.avatarSrc}
                alt={session.avatarAlt}
                fallbackLabel={profileButtonLabel}
              />
              <span className={sharedStyles.srOnly}>{profileButtonLabel}</span>
            </button>
          </li>

          <li className={styles.mobileBottomItem}>
            <button
              ref={preferencesTriggerRef}
              type="button"
              className={`button button--ghost ${sharedStyles.iconButton} ${styles.mobileNavButton}`}
              aria-label={isSectionOpen('preferences') ? a11y.closeMenu : a11y.preferencesToggle}
              aria-expanded={isSectionOpen('preferences')}
              aria-controls={panelId}
              aria-haspopup="dialog"
              onClick={() => toggleSection('preferences')}
            >
              <IoIosSettings />
              <span className={sharedStyles.srOnly}>{labels.preferences}</span>
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}
