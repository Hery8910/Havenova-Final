'use client';
import { useCallback, useId, useRef, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
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
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';

type TabletPanel = 'menu' | 'account' | null;

export interface NavbarTabletViewProps {
  auth: AuthUser;
  content: ResolvedNavbarContent;
  onNavigate: (href: string) => void;
  onLogout: () => Promise<void>;
  bellSlot?: (() => JSX.Element) | null;
}

export function NavbarTabletView({
  auth,
  content,
  onNavigate,
  onLogout,
  bellSlot,
}: NavbarTabletViewProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const tabletNavRef = useRef<HTMLElement>(null);
  const accountPanelId = useId();
  const menuPanelId = useId();
  const accountTitleId = useId();
  const menuTitleId = useId();
  const { branding, primaryLinks, userLinks, labels, preferences, session, a11y } = content;
  const BellSlot = bellSlot;
  const menuPanelTitle = labels.menu;
  const profileButtonLabel = auth.isLogged ? labels.profile : labels.account;
  const activePanel: TabletPanel = menuOpen ? 'menu' : accountOpen ? 'account' : null;
  const dismissPanels = useCallback(() => {
    setAccountOpen(false);
    setMenuOpen(false);
  }, []);

  useDismissibleLayer({
    enabled: Boolean(activePanel),
    refs: [tabletNavRef],
    onDismiss: dismissPanels,
  });

  const handleAccountToggle = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }

    setAccountOpen((prev) => !prev);
  };

  const handleMenuToggle = () => {
    if (accountOpen) {
      setAccountOpen(false);
    }

    setMenuOpen((prev) => !prev);
  };

  const handlePanelNavigation = (href: string) => {
    onNavigate(href);
    dismissPanels();
  };

  const closeActivePanel = () => {
    if (!activePanel) return;

    dismissPanels();
  };

  return (
    <section ref={tabletNavRef} className={styles.tabletShell}>
      <section className={styles.tabletLayout}>
        <header className={styles.tabletHeader}>
          <NavbarBrand
            linkClassName={styles.logoLink}
            imageClassName={styles.logoImage}
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
                  labels={preferences.languageSwitcher}
                />
              </div>
            </div>
            <div className={styles.accountActionsGroup}>
              {BellSlot ? (
                <div className={styles.notificationSlot}>
                  <BellSlot />
                </div>
              ) : null}
              <button
                type="button"
                className={`${sharedStyles.iconButton} ${styles.profileButton} ${
                  accountOpen ? `${sharedStyles.iconButtonActive} ${styles.profileButtonOpen}` : ''
                }`}
                aria-label={a11y.profileToggle}
                aria-expanded={accountOpen}
                aria-controls={accountPanelId}
                onClick={handleAccountToggle}
              >
                <CgProfile />
                <span className={styles.srOnly}>{profileButtonLabel}</span>
              </button>
            </div>
            <button
              type="button"
              className={`${sharedStyles.menuButton} ${styles.menuButton} ${
                menuOpen ? styles.menuButtonOpen : ''
              }`}
              aria-label={menuOpen ? a11y.closeMenu : a11y.openMenu}
              aria-expanded={menuOpen}
              aria-controls={menuPanelId}
              onClick={handleMenuToggle}
            >
              <span className={styles.menuLine} aria-hidden="true" />
              <span className={styles.menuLine} aria-hidden="true" />
            </button>
          </section>
        </header>
        {activePanel && (
          <div className={styles.panelWrapper}>
            <div className={styles.tabletSection}>
              <nav
                className={`${styles.tabletPanel} glass-panel--base`}
                id={activePanel === 'menu' ? menuPanelId : accountPanelId}
                aria-labelledby={activePanel === 'menu' ? menuTitleId : accountTitleId}
              >
                <NavbarPanelSection
                  title={activePanel === 'menu' ? menuPanelTitle : session.accountMenuTitle}
                  titleId={activePanel === 'menu' ? menuTitleId : accountTitleId}
                  headerClassName={styles.panelHeader}
                  titleClassName={styles.panelTitle}
                >
                  {activePanel === 'menu' ? (
                    <NavbarLinkList
                      items={primaryLinks}
                      onItemClick={handlePanelNavigation}
                      listClassName={styles.tabletList}
                      itemClassName={styles.tabletItem}
                      buttonClassName={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                      iconClassName={styles.linkIcon}
                      imageClassName={styles.linkImage}
                    />
                  ) : (
                    <NavbarAccountContent
                      authIsLogged={session.isLoggedIn}
                      userLinks={userLinks}
                      logoutLabel={session.logoutLabel}
                      onItemClick={handlePanelNavigation}
                      onLogoutClick={() => {
                        dismissPanels();
                        void onLogout();
                      }}
                      listClassName={styles.tabletList}
                      itemClassName={styles.tabletItem}
                      buttonClassName={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                      iconClassName={styles.linkIcon}
                    />
                  )}
                </NavbarPanelSection>
              </nav>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
