'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState, type JSX } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuLogOut } from 'react-icons/lu';

import styles from './SideNav.module.css';

export type SideNavItemMatch = 'exact' | 'prefix';

export interface SideNavItem {
  key: string;
  label: string;
  href: string;
  icon: JSX.Element;
  match?: SideNavItemMatch;
}

export interface SideNavProps {
  mainItems: SideNavItem[];
  footerItems?: SideNavItem[];
  onLogout: () => void | Promise<void>;
  logoutLabel: string;
  navigationLabel: string;
  collapseLabel: string;
  expandLabel: string;
  mainListLabel?: string;
  footerListLabel?: string;
  id?: string;
  className?: string;
  collapseBreakpoint?: number;
  initialCollapsed?: boolean;
}

function isItemActive(pathname: string | null, item: SideNavItem) {
  if (!pathname) return false;
  if (item.match === 'prefix') {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return pathname === item.href;
}

export function SideNav({
  mainItems,
  footerItems = [],
  onLogout,
  logoutLabel,
  navigationLabel,
  collapseLabel,
  expandLabel,
  mainListLabel,
  footerListLabel,
  id,
  className,
  collapseBreakpoint = 1024,
  initialCollapsed = false,
}: SideNavProps) {
  const pathname = usePathname();
  const reactId = useId();
  const navId = id ?? `side-nav-${reactId.replace(/:/g, '')}`;
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${collapseBreakpoint}px)`);
    const applyMode = (matches: boolean) => {
      setIsCollapsed(matches);
    };

    applyMode(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [collapseBreakpoint]);

  const rootClassName = [styles.root, className].filter(Boolean).join(' ');
  const actionClassName = [styles.action, isCollapsed ? styles.actionCollapsed : '', 'button', 'button--ghost']
    .filter(Boolean)
    .join(' ');

  return (
    <nav id={navId} className={rootClassName} aria-label={navigationLabel}>
      <div className={styles.mainSection}>
        {!isCollapsed && mainListLabel ? (
          <p className={styles.sectionLabel}>{mainListLabel}</p>
        ) : null}
        <ul className={styles.list} aria-label={mainListLabel}>
          {mainItems.map((item) => {
            const active = isItemActive(pathname, item);

            return (
              <li key={item.key} className={styles.item}>
                <Link
                  href={item.href}
                  className={[actionClassName, active ? 'button--active' : ''].filter(Boolean).join(' ')}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {!isCollapsed ? <span className={styles.label}>{item.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.footerSection}>
        {!isCollapsed && footerListLabel ? (
          <p className={styles.sectionLabel}>{footerListLabel}</p>
        ) : null}
        <ul className={styles.list} aria-label={footerListLabel}>
          {footerItems.map((item) => {
            const active = isItemActive(pathname, item);

            return (
              <li key={item.key} className={styles.item}>
                <Link
                  href={item.href}
                  className={[actionClassName, active ? 'button--active' : ''].filter(Boolean).join(' ')}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={styles.icon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {!isCollapsed ? <span className={styles.label}>{item.label}</span> : null}
                </Link>
              </li>
            );
          })}

          <li className={styles.item}>
            <button
              type="button"
              onClick={onLogout}
              className={actionClassName}
              aria-label={logoutLabel}
              title={isCollapsed ? logoutLabel : undefined}
            >
              <span className={styles.icon} aria-hidden="true">
                <LuLogOut />
              </span>
              {!isCollapsed ? <span className={styles.label}>{logoutLabel}</span> : null}
            </button>
          </li>
        </ul>

        <button
          type="button"
          className={`${actionClassName} ${styles.toggleButton}`}
          aria-controls={navId}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? expandLabel : collapseLabel}
          title={isCollapsed ? expandLabel : collapseLabel}
          onClick={() => {
            setIsCollapsed((current) => !current);
          }}
        >
          <span className={styles.icon} aria-hidden="true">
            {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </span>
          {!isCollapsed ? <span className={styles.label}>{collapseLabel}</span> : null}
        </button>
      </div>
    </nav>
  );
}
