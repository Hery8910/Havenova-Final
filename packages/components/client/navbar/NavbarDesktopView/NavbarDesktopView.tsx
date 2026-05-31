'use client';
import { createPortal } from 'react-dom';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import ThemeToggler from '../../../themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../languageSwitcher/LanguageSwitcher';
import styles from './NavbarDesktopView.module.css';
import sharedStyles from '../NavbarShared.module.css';
import type { ResolvedNavbarContent } from '../navbar.shared';
import { NavbarBrand } from '../components/NavbarBrand';
import { NavbarAccountContent } from '../components/NavbarAccountContent';
import { NavbarLinkList } from '../components/NavbarLinkList';
import { NavbarProfileTrigger } from '../components/NavbarProfileTrigger';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';
import { useNavbarPanelState } from '../hooks/useNavbarPanelState';

export interface NavbarDesktopViewProps {
  content: ResolvedNavbarContent;
  onNavigate: (href: string) => void;
  onLogout: () => Promise<void>;
  hideAccountControls?: boolean;
  bellSlot?: (() => JSX.Element) | null;
}

type DropdownPosition = {
  top: number;
  right: number;
};

export function NavbarDesktopView({
  content,
  onNavigate,
  onLogout,
  hideAccountControls = false,
  bellSlot,
}: NavbarDesktopViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    right: 0,
  });
  const profileSlotRef = useRef<HTMLDivElement>(null);
  const accountPanelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const accountPanelId = useId();
  const accountTitleId = useId();
  const { branding, primaryLinks, userLinks, labels, preferences, session, a11y } = content;
  const BellSlot = bellSlot;
  const { activePanel, visiblePanel, closePanel, togglePanel, isPanelOpen } =
    useNavbarPanelState<'account'>();
  const userMenuOpen = isPanelOpen('account');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useDismissibleLayer({
    enabled: userMenuOpen,
    refs: [profileSlotRef, accountPanelRef],
    onDismiss: closePanel,
  });

  useLayoutEffect(() => {
    if (!userMenuOpen) return;

    const updateDropdownPosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();

      if (!triggerRect) return;

      setDropdownPosition({
        top: triggerRect.bottom + 24,
        right: window.innerWidth - triggerRect.right,
      });
    };

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [userMenuOpen]);

  return (
    <div className={styles.desktopShell}>
      <header className={` ${styles.desktopLayout} card--neutral`}>
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
        <NavbarLinkList items={primaryLinks} onItemClick={onNavigate} variant="inline" hideIcons />
        <section className={styles.navActions} aria-label={labels.preferences}>
          <div className={styles.utilityActions}>
            <ThemeToggler display="icon" labels={preferences.themeToggle} />
            <LanguageSwitcher
              presentation="dropdown"
              triggerDisplay="icon"
              panelVariant="navbar"
              labels={preferences.languageSwitcher}
            />
          </div>
          {!hideAccountControls ? (
            <div className={styles.accountActions}>
              {BellSlot ? (
                <div className={sharedStyles.notificationSlot}>
                  <BellSlot />
                </div>
              ) : null}
              <div className={styles.profileSlot} ref={profileSlotRef}>
                <button
                  ref={triggerRef}
                  type="button"
                  className={`button button--ghost ${sharedStyles.iconButton}`}
                  aria-label={a11y.profileToggle}
                  aria-expanded={userMenuOpen}
                  aria-controls={accountPanelId}
                  onClick={() => togglePanel('account')}
                >
                  <NavbarProfileTrigger
                    avatarSrc={session.avatarSrc}
                    alt={session.avatarAlt}
                    fallbackLabel={labels.profile}
                  />
                  <span className={sharedStyles.srOnly}>{labels.profile}</span>
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </header>
      {!hideAccountControls && isMounted
        ? (createPortal(
            <div
              className={`${styles.desktopDropdown} ${
                userMenuOpen ? styles.desktopDropdownOpen : ''
              }`}
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
              }}
            >
              <nav
                ref={accountPanelRef}
                id={accountPanelId}
                className={`card card--neutral ${styles.accountNavigation} ${
                  userMenuOpen ? styles.accountNavigationOpen : ''
                }`}
                aria-labelledby={userMenuOpen ? accountTitleId : undefined}
                aria-hidden={!userMenuOpen}
              >
                {visiblePanel === 'account' ? (
                  <>
                    <div className={sharedStyles.panelHeader}>
                      <h2
                        id={accountTitleId}
                        className={`${styles.accountTitle} ${sharedStyles.panelIdentityTitle}`}
                        title={session.displayName ?? session.accountMenuTitle}
                      >
                        {session.displayName ?? session.accountMenuTitle}
                      </h2>
                    </div>
                    <NavbarAccountContent
                      authIsLogged={session.isLoggedIn}
                      userLinks={userLinks}
                      logoutLabel={session.logoutLabel}
                      onItemClick={(href) => {
                        closePanel();
                        onNavigate(href);
                      }}
                      onLogoutClick={() => {
                        closePanel();
                        void onLogout();
                      }}
                      animated
                      animationDirection="down"
                    />
                  </>
                ) : null}
              </nav>
            </div>,
            document.body
          ) as unknown as JSX.Element)
        : null}
    </div>
  );
}
