'use client';
import { useCallback, useId, useRef, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import styles from './NavbarDesktopView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import type { ResolvedNavbarContent } from '../navbar.shared';
import { NavbarBrand } from '../components/NavbarBrand';
import { NavbarAccountContent } from '../components/NavbarAccountContent';
import { NavbarLinkList } from '../components/NavbarLinkList';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';

export interface NavbarDesktopViewProps {
  content: ResolvedNavbarContent;
  onNavigate: (href: string) => void;
  onLogout: () => Promise<void>;
  bellSlot?: (() => JSX.Element) | null;
}

export function NavbarDesktopView({
  content,
  onNavigate,
  onLogout,
  bellSlot,
}: NavbarDesktopViewProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const profileSlotRef = useRef<HTMLDivElement>(null);
  const accountPanelId = useId();
  const accountTitleId = useId();
  const { branding, primaryLinks, userLinks, labels, preferences, session, a11y } = content;
  const BellSlot = bellSlot;
  const closeUserMenu = useCallback(() => {
    setUserMenuOpen(false);
  }, []);

  useDismissibleLayer({
    enabled: userMenuOpen,
    refs: [profileSlotRef],
    onDismiss: closeUserMenu,
  });

  return (
    <div className={styles.desktopShell}>
      <header className={styles.desktopLayout}>
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
        <NavbarLinkList
          items={primaryLinks}
          onItemClick={onNavigate}
          listClassName={styles.navList}
          itemClassName={styles.navItem}
          buttonClassName={`${sharedStyles.navLinkButton} ${styles.navLink}`}
          hideIcons
        />
        <section className={styles.navActions} aria-label={labels.preferences}>
          <div className={styles.utilityActions}>
            <ThemeToggler display="icon" labels={preferences.themeToggle} />
            <LanguageSwitcher
              presentation="dropdown"
              triggerDisplay="icon"
              labels={preferences.languageSwitcher}
            />
          </div>
          <div className={styles.accountActions}>
            {BellSlot ? (
              <div className={styles.notificationSlot}>
                <BellSlot />
              </div>
            ) : null}
            <div className={styles.profileSlot} ref={profileSlotRef}>
              <button
                type="button"
                className={`${sharedStyles.iconButton} ${styles.profileButton} ${
                  userMenuOpen ? `${sharedStyles.iconButtonActive} ${styles.profileButtonOpen}` : ''
                }`}
                aria-label={a11y.profileToggle}
                aria-expanded={userMenuOpen}
                aria-controls={accountPanelId}
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <CgProfile />
                <span className={styles.srOnly}>{labels.profile}</span>
              </button>
              {userMenuOpen && (
                <div className={styles.desktopDropdown}>
                  <nav
                    id={accountPanelId}
                    className={`glass-panel--base ${styles.accountNavigation}`}
                    aria-labelledby={accountTitleId}
                  >
                    <div className={styles.accountHeader}>
                      <h2 id={accountTitleId} className={styles.accountTitle}>
                        {session.accountMenuTitle}
                      </h2>
                    </div>
                    <NavbarAccountContent
                      authIsLogged={session.isLoggedIn}
                      userLinks={userLinks}
                      logoutLabel={session.logoutLabel}
                      onItemClick={(href) => {
                        closeUserMenu();
                        onNavigate(href);
                      }}
                      onLogoutClick={() => {
                        closeUserMenu();
                        void onLogout();
                      }}
                      listClassName={styles.userList}
                      itemClassName={styles.userItem}
                      buttonClassName={`${sharedStyles.navLinkButton} ${styles.navLink}`}
                      iconClassName={styles.linkIcon}
                    />
                  </nav>
                </div>
              )}
            </div>
          </div>
        </section>
      </header>
    </div>
  );
}
