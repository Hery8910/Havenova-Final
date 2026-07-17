'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LuMenu, LuX } from 'react-icons/lu';

import styles from '../../layout.module.css';
import { DashboardShellHeader } from './DashboardShellHeader';
import { DashboardShellNav } from './DashboardShellNav';
import { resolveDashboardHeaderMeta, type DashboardShellLang } from '../../dashboardShell';
import { useLang } from '../../../../../../../packages/hooks';
import { useFocusTrap } from '../../../../../../../packages/utils/accessibility/useFocusTrap';

type DashboardWorkspaceShellProps = {
  children: React.ReactNode;
};

export function DashboardWorkspaceShell({ children }: DashboardWorkspaceShellProps) {
  const pathname = usePathname();
  const lang = useLang() as DashboardShellLang;
  const dialogId = useId();
  const mobileNavTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavDialogRef = useRef<HTMLElement>(null);
  const mobileNavCloseRef = useRef<HTMLButtonElement>(null);
  const wasMobileNavOpenRef = useRef(false);
  const shouldRestoreMobileNavFocusRef = useRef(true);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const workspaceLabel = 'Dashboard workspace';
  const mobileHeaderMeta = useMemo(
    () => resolveDashboardHeaderMeta(pathname, lang),
    [lang, pathname]
  );
  const mobileNavLabels =
    lang === 'es'
      ? {
          open: 'Abrir navegación',
          close: 'Cerrar navegación',
          title: 'Ruta actual',
        }
      : lang === 'de'
        ? {
            open: 'Navigation öffnen',
            close: 'Navigation schließen',
            title: 'Aktuelle Route',
          }
        : {
            open: 'Open navigation',
            close: 'Close navigation',
            title: 'Current route',
          };

  useEffect(() => {
    if (!isMobileNavOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  useFocusTrap({
    enabled: isMobileNavOpen,
    containerRef: mobileNavDialogRef,
    initialFocusRef: mobileNavCloseRef,
    onEscape: () => {
      shouldRestoreMobileNavFocusRef.current = true;
      setIsMobileNavOpen(false);
    },
  });

  useEffect(() => {
    if (!isMobileNavOpen && wasMobileNavOpenRef.current && shouldRestoreMobileNavFocusRef.current) {
      mobileNavTriggerRef.current?.focus();
    }
    wasMobileNavOpenRef.current = isMobileNavOpen;
  }, [isMobileNavOpen]);

  useEffect(() => {
    shouldRestoreMobileNavFocusRef.current = false;
    setIsMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1100px)');
    const closeWhenDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        shouldRestoreMobileNavFocusRef.current = false;
        setIsMobileNavOpen(false);
      }
    };

    media.addEventListener('change', closeWhenDesktop);
    return () => media.removeEventListener('change', closeWhenDesktop);
  }, []);

  return (
    <main className={styles.page} data-ui-foundation="operational">
      <section
        className={[styles.workspace, isNavCollapsed ? styles.workspaceNavCollapsed : '']
          .filter(Boolean)
          .join(' ')}
        aria-label={workspaceLabel}
      >
        <aside className={styles.navColumn} aria-label="Dashboard navigation">
          <DashboardShellNav
            className={styles.sideNav}
            isCollapsed={isNavCollapsed}
            onCollapsedChange={setIsNavCollapsed}
          />
        </aside>

        <section className={styles.contentColumn}>
          <div className={styles.mobileTopbar}>
            <button
              ref={mobileNavTriggerRef}
              type="button"
              className={styles.mobileNavTrigger}
              aria-label={mobileNavLabels.open}
              aria-haspopup="dialog"
              aria-controls={dialogId}
              aria-expanded={isMobileNavOpen}
              onClick={() => {
                shouldRestoreMobileNavFocusRef.current = true;
                setIsMobileNavOpen((current) => !current);
              }}
            >
              <span className={styles.mobileNavTriggerIcon} aria-hidden="true">
                <LuMenu />
              </span>
              <span className={styles.mobileNavTriggerCopy}>
                <span className={styles.mobileNavTriggerTitle}>/{mobileHeaderMeta.routeLabel}</span>
              </span>
            </button>
          </div>
          <header className={styles.header}>
            <DashboardShellHeader />
          </header>
          <section className={styles.main}>{children}</section>
        </section>
      </section>

      {isMobileNavOpen ? (
        <div className={styles.mobileNavOverlay}>
          <div
            className={styles.mobileNavBackdrop}
            aria-hidden="true"
            onClick={() => {
              shouldRestoreMobileNavFocusRef.current = true;
              setIsMobileNavOpen(false);
            }}
          />
          <section
            ref={mobileNavDialogRef}
            className={styles.mobileNavPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${dialogId}-title`}
            id={dialogId}
            tabIndex={-1}
          >
            <div className={styles.mobileNavPanelHeader}>
              <div className={styles.mobileNavPanelCopy}>
                <h2 id={`${dialogId}-title`} className={styles.mobileNavPanelTitle}>
                  /{mobileHeaderMeta.routeLabel}
                </h2>
              </div>

              <button
                ref={mobileNavCloseRef}
                type="button"
                className={styles.mobileNavClose}
                aria-label={mobileNavLabels.close}
                onClick={() => {
                  shouldRestoreMobileNavFocusRef.current = true;
                  setIsMobileNavOpen(false);
                }}
              >
                <LuX aria-hidden="true" />
              </button>
            </div>

            <div className={styles.mobileNavPanelBody}>
              <DashboardShellNav
                className={styles.mobileSideNav}
                isCollapsed={false}
                onCollapsedChange={() => {}}
                showCollapseControl={false}
                presentation="drawer"
                onItemSelect={() => {
                  shouldRestoreMobileNavFocusRef.current = false;
                  setIsMobileNavOpen(false);
                }}
              />
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
