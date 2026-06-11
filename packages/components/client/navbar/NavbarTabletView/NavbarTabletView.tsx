'use client';
import { useId, useRef } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import styles from './NavbarTabletView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import { AuthUser } from '../../../../types';
import type { ResolvedNavbarContent } from '../navbar.shared';
import { NavbarAccountContent } from '../components/NavbarAccountContent';
import { NavbarBrand } from '../components/NavbarBrand';
import { NavbarLinkList } from '../components/NavbarLinkList';
import { NavbarPanelSection } from '../components/NavbarPanelSection';
import { NavbarProfileTrigger } from '../components/NavbarProfileTrigger';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';
import { useNavbarPanelState } from '../hooks/useNavbarPanelState';
import { useFocusTrap } from '../../../../utils/accessibility/useFocusTrap';

type TabletPanel = 'menu' | 'account' | null;

export interface NavbarTabletViewProps {
  auth: AuthUser;
  content: ResolvedNavbarContent;
  onNavigate: (href: string) => void;
  onLogout: () => Promise<void>;
  hideAccountControls?: boolean;
  bellSlot?: (() => JSX.Element) | null;
}

export function NavbarTabletView({
  auth,
  content,
  onNavigate,
  onLogout,
  hideAccountControls = false,
  bellSlot,
}: NavbarTabletViewProps) {
  const tabletNavRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const accountTriggerRef = useRef<HTMLButtonElement>(null);
  const activePanelRef = useRef<HTMLElement>(null);
  const accountPanelId = useId();
  const menuPanelId = useId();
  const accountTitleId = useId();
  const menuTitleId = useId();
  const { branding, primaryLinks, userLinks, labels, preferences, session, a11y } = content;
  const BellSlot = bellSlot;
  const menuPanelTitle = labels.menu;
  const profileButtonLabel = auth.isLogged ? labels.profile : labels.account;
  const {
    activePanel,
    closePanel,
    togglePanel,
    isPanelOpen,
  } = useNavbarPanelState<Exclude<TabletPanel, null>>();
  const accountOpen = isPanelOpen('account');
  const menuOpen = isPanelOpen('menu');

  useDismissibleLayer({
    enabled: Boolean(activePanel),
    refs: [tabletNavRef],
    onDismiss: closePanel,
  });

  useFocusTrap({
    enabled: Boolean(activePanel),
    containerRef: activePanelRef,
    returnFocusRef: activePanel === 'menu' ? menuTriggerRef : accountTriggerRef,
    onEscape: closePanel,
  });

  const handlePanelNavigation = (href: string) => {
    onNavigate(href);
    closePanel();
  };

  const closeActivePanel = () => {
    if (!activePanel) return;

    closePanel();
  };

  return (
    <section ref={tabletNavRef} className={styles.tabletShell}>
      <section className={styles.tabletLayout}>
        <header className={styles.tabletHeader}>
          <NavbarBrand
            linkClassName={sharedStyles.logoLink}
            imageClassName={sharedStyles.logoImage}
            ariaLabel={a11y.homeLink}
            logoAlt={a11y.logoAlt}
            href={branding.homeHref}
            logoSrc={branding.desktopLogoSrc}
            width={branding.desktopLogoWidth}
            height={branding.desktopLogoHeight}
          />

          <section className={styles.tabletActions} aria-label={labels.preferences}>
            <div className={styles.utilityActionsGroup}>
              <ThemeToggler display="icon" labels={preferences.themeToggle} />
              <div
                onPointerDownCapture={closeActivePanel}
                onKeyDownCapture={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    closeActivePanel();
                  }
                }}
              >
                <LanguageSwitcher
                  presentation="dropdown"
                  triggerDisplay="icon"
                  panelVariant="navbar"
                  labels={preferences.languageSwitcher}
                />
              </div>
            </div>
            {!hideAccountControls ? (
              <div className={styles.accountActionsGroup}>
                {BellSlot ? (
                  <div className={sharedStyles.notificationSlot}>
                    <BellSlot />
                  </div>
                ) : null}
                <button
                  ref={accountTriggerRef}
                  type="button"
                  className={`button button--ghost ${sharedStyles.iconButton} ${sharedStyles.profileButton}`}
                  aria-label={a11y.profileToggle}
                  aria-expanded={accountOpen}
                  aria-controls={accountPanelId}
                  onClick={() => togglePanel('account')}
                >
                  <NavbarProfileTrigger
                    avatarSrc={session.avatarSrc}
                    alt={session.avatarAlt}
                    fallbackLabel={profileButtonLabel}
                  />
                  <span className={sharedStyles.srOnly}>{profileButtonLabel}</span>
                </button>
              </div>
            ) : null}
            <button
              ref={menuTriggerRef}
              type="button"
              className={`button button--ghost ${sharedStyles.menuButton} ${styles.menuButton} ${
                menuOpen ? styles.menuButtonOpen : ''
              }`}
              aria-label={menuOpen ? a11y.closeMenu : a11y.openMenu}
              aria-expanded={menuOpen}
              aria-controls={menuPanelId}
              onClick={() => togglePanel('menu')}
            >
              <span className={styles.menuLine} aria-hidden="true" />
              <span className={styles.menuLine} aria-hidden="true" />
            </button>
          </section>
        </header>
        <div className={styles.panelWrapper}>
          <div className={styles.tabletSection}>
            <nav
              ref={activePanelRef}
              className={`${styles.tabletPanel} card card--neutral ${
                activePanel && (!hideAccountControls || activePanel === 'menu')
                  ? styles.tabletPanelOpen
                  : ''
              }`}
              tabIndex={-1}
              id={activePanel ? (activePanel === 'menu' ? menuPanelId : accountPanelId) : undefined}
              aria-labelledby={
                activePanel ? (activePanel === 'menu' ? menuTitleId : accountTitleId) : undefined
              }
              aria-hidden={!activePanel}
            >
              {activePanel ? (
                <NavbarPanelSection
                  title={
                    activePanel === 'menu'
                      ? menuPanelTitle
                      : (session.displayName ?? session.accountMenuTitle)
                  }
                  titleId={activePanel === 'menu' ? menuTitleId : accountTitleId}
                  headerClassName={sharedStyles.panelHeader}
                  titleClassName={`${styles.panelTitle} ${
                    activePanel === 'account' ? sharedStyles.panelIdentityTitle : ''
                  }`}
                >
                  {activePanel === 'menu' ? (
                    <NavbarLinkList
                      items={primaryLinks}
                      onItemClick={handlePanelNavigation}
                      animated
                      animationDirection="down"
                    />
                  ) : !hideAccountControls ? (
                    <NavbarAccountContent
                      authIsLogged={session.isLoggedIn}
                      userLinks={userLinks}
                      logoutLabel={session.logoutLabel}
                      onItemClick={handlePanelNavigation}
                      onLogoutClick={() => {
                        closePanel();
                        void onLogout();
                      }}
                      animated
                      animationDirection="down"
                    />
                  ) : null}
                </NavbarPanelSection>
              ) : null}
            </nav>
          </div>
        </div>
      </section>
    </section>
  );
}
