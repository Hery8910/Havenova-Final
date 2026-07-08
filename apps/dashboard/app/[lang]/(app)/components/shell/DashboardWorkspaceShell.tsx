'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { LuMenu, LuX } from 'react-icons/lu';

import styles from '../../layout.module.css';
import { DashboardShellHeader } from './DashboardShellHeader';
import { DashboardShellNav } from './DashboardShellNav';
import { resolveDashboardHeaderMeta, type DashboardShellLang } from '../../dashboardShell';
import { useLang } from '../../../../../../../packages/hooks';

type DashboardWorkspaceShellProps = {
  children: React.ReactNode;
};

export function DashboardWorkspaceShell({ children }: DashboardWorkspaceShellProps) {
  const pathname = usePathname();
  const lang = useLang() as DashboardShellLang;
  const dialogId = useId();
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

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <main className={styles.page}>
      <section
        className={[styles.workspace, isNavCollapsed ? styles.workspaceNavCollapsed : '']
          .filter(Boolean)
          .join(' ')}
        aria-label={workspaceLabel}
      >
        <aside
          className={`card card--secondary ${styles.navColumn}`}
          aria-label="Dashboard navigation"
        >
          <DashboardShellNav
            className={styles.sideNav}
            isCollapsed={isNavCollapsed}
            onCollapsedChange={setIsNavCollapsed}
          />
        </aside>

        <section className={styles.contentColumn}>
          <div className={`card card--neutral ${styles.mobileTopbar}`}>
            <button
              type="button"
              className={`button button--ghost ${styles.mobileNavTrigger}`}
              aria-label={mobileNavLabels.open}
              aria-haspopup="dialog"
              aria-controls={dialogId}
              aria-expanded={isMobileNavOpen}
              onClick={() => {
                setIsMobileNavOpen(true);
              }}
            >
              <span className={styles.mobileNavTriggerIcon} aria-hidden="true">
                <LuMenu />
              </span>
              <span className={styles.mobileNavTriggerCopy}>
                <span className={styles.mobileNavTriggerTitle}>
                  /{mobileHeaderMeta.routeLabel}
                </span>
              </span>
            </button>
          </div>
          <header className={`card card--neutral ${styles.header}`}>
            <DashboardShellHeader />
          </header>
          <section className={styles.main}>{children}</section>
        </section>
      </section>

      {isMobileNavOpen ? (
        <div
          className={`${styles.mobileNavOverlay} app-anim-overlay-enter`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${dialogId}-title`}
          id={dialogId}
        >
          <div className={`card card--secondary ${styles.mobileNavPanel}`}>
            <div className={styles.mobileNavPanelHeader}>
              <div className={styles.mobileNavPanelCopy}>
                <h2 id={`${dialogId}-title`} className={styles.mobileNavPanelTitle}>
                  /{mobileHeaderMeta.routeLabel}
                </h2>
              </div>

              <button
                type="button"
                className={`button button--ghost ${styles.mobileNavClose}`}
                aria-label={mobileNavLabels.close}
                onClick={() => {
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
                  setIsMobileNavOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
