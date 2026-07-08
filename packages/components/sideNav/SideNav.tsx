'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useMemo, useState, type JSX } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuChevronDown, LuChevronRight, LuLogOut } from 'react-icons/lu';

import styles from './SideNav.module.css';

export type SideNavItemMatch = 'exact' | 'prefix';

export interface SideNavItem {
  key: string;
  label: string;
  href: string;
  icon: JSX.Element;
  match?: SideNavItemMatch;
  level?: number;
}

export interface SideNavSection {
  key: string;
  label?: string;
  icon?: JSX.Element;
  items: SideNavItem[];
}

export interface SideNavProps {
  mainItems: SideNavItem[];
  footerItems?: SideNavItem[];
  mainSections?: SideNavSection[];
  footerSections?: SideNavSection[];
  initialExpandedSectionKeys?: string[];
  onLogout: () => void | Promise<void>;
  logoutLabel: string;
  navigationLabel: string;
  collapseLabel: string;
  expandLabel: string;
  mainListLabel?: string;
  footerListLabel?: string;
  logoutSectionKey?: string;
  id?: string;
  className?: string;
  collapseBreakpoint?: number;
  initialCollapsed?: boolean;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onItemSelect?: () => void;
  showCollapseControl?: boolean;
  presentation?: 'sidebar' | 'drawer';
}

function isItemActive(pathname: string | null, item: SideNavItem) {
  if (!pathname) return false;
  if (item.match === 'prefix') {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return pathname === item.href;
}

function normalizeSections(
  sections: SideNavSection[] | undefined,
  items: SideNavItem[],
  fallbackKey: string,
  fallbackLabel?: string
) {
  if (sections?.length) {
    return sections;
  }

  return [
    {
      key: fallbackKey,
      label: fallbackLabel,
      items,
    },
  ];
}

function hasActiveItem(pathname: string | null, section: SideNavSection) {
  return section.items.some((item) => isItemActive(pathname, item));
}

export function SideNav({
  mainItems,
  footerItems = [],
  mainSections,
  footerSections,
  initialExpandedSectionKeys = [],
  onLogout,
  logoutLabel,
  navigationLabel,
  collapseLabel,
  expandLabel,
  mainListLabel,
  footerListLabel,
  logoutSectionKey,
  id,
  className,
  collapseBreakpoint = 1024,
  initialCollapsed = false,
  isCollapsed: controlledCollapsed,
  onCollapsedChange,
  onItemSelect,
  showCollapseControl = true,
  presentation = 'sidebar',
}: SideNavProps) {
  const pathname = usePathname();
  const reactId = useId();
  const navId = id ?? `side-nav-${reactId.replace(/:/g, '')}`;
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(initialCollapsed);
  const isCollapsed = controlledCollapsed ?? uncontrolledCollapsed;

  const setCollapsed = (value: boolean | ((current: boolean) => boolean)) => {
    const nextValue = typeof value === 'function' ? value(isCollapsed) : value;

    if (controlledCollapsed === undefined) {
      setUncontrolledCollapsed(nextValue);
    }

    onCollapsedChange?.(nextValue);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${collapseBreakpoint}px)`);
    const applyMode = (matches: boolean) => {
      setCollapsed(matches);
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

  const rootClassName = [styles.root, presentation === 'drawer' ? styles.drawer : '', className]
    .filter(Boolean)
    .join(' ');
  const resolvedMainSections = useMemo(
    () => normalizeSections(mainSections, mainItems, 'main', mainListLabel),
    [mainItems, mainListLabel, mainSections]
  );
  const resolvedFooterSections = useMemo(
    () => normalizeSections(footerSections, footerItems, 'footer', footerListLabel),
    [footerItems, footerListLabel, footerSections]
  );
  const allSections = useMemo(
    () => [...resolvedMainSections, ...resolvedFooterSections],
    [resolvedFooterSections, resolvedMainSections]
  );
  const [expandedSectionKey, setExpandedSectionKey] = useState<string | null>(() => {
    const activeSection = allSections.find((section) => hasActiveItem(pathname, section));
    if (activeSection) {
      return activeSection.key;
    }

    return initialExpandedSectionKeys[0] ?? allSections[0]?.key ?? null;
  });

  useEffect(() => {
    if (!allSections.length) {
      setExpandedSectionKey(null);
      return;
    }

    setExpandedSectionKey((current) => {
      if (current && allSections.some((section) => section.key === current)) {
        return current;
      }

      const activeSection = allSections.find((section) => hasActiveItem(pathname, section));
      if (activeSection) {
        return activeSection.key;
      }

      return initialExpandedSectionKeys[0] ?? allSections[0]?.key ?? null;
    });
  }, [allSections, initialExpandedSectionKeys, pathname]);

  useEffect(() => {
    const activeSection = allSections.find((section) => hasActiveItem(pathname, section));
    if (!activeSection) {
      return;
    }

    setExpandedSectionKey(activeSection.key);
  }, [allSections, pathname]);

  const actionClassName = [
    styles.action,
    isCollapsed ? styles.actionCollapsed : '',
    'button',
    'button--ghost',
  ]
    .filter(Boolean)
    .join(' ');
  const sectionToggleClassName = [
    styles.sectionToggle,
    styles.headerButton,
    isCollapsed ? styles.sectionToggleCollapsed : '',
    'button',
  ]
    .filter(Boolean)
    .join(' ');

  const renderSection = (section: SideNavSection) => {
    const isExpanded = expandedSectionKey === section.key;
    const sectionHeadingId = `${navId}-${section.key}-heading`;
    const sectionListId = `${navId}-${section.key}-items`;

    return (
      <section
        key={section.key}
        className={[styles.sectionBlock, isExpanded ? styles.sectionExpanded : '']
          .filter(Boolean)
          .join(' ')}
        aria-labelledby={section.label ? sectionHeadingId : undefined}
      >
        {section.label ? (
          <h2 className={styles.sectionHeading}>
            <button
              id={sectionHeadingId}
              type="button"
              className={sectionToggleClassName}
              aria-expanded={isExpanded}
              aria-controls={sectionListId}
              onClick={() => {
                setExpandedSectionKey((current) => (current === section.key ? null : section.key));
              }}
              title={isCollapsed ? section.label : undefined}
            >
              <span className={styles.sectionToggleLead}>
                {section.icon ? (
                  <span className={styles.sectionToggleSectionIcon} aria-hidden="true">
                    {section.icon}
                  </span>
                ) : null}
                {!isCollapsed ? (
                  <span className={styles.sectionToggleLabel}>{section.label}</span>
                ) : null}
              </span>
              <span className={styles.sectionToggleIcon} aria-hidden="true">
                {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
              </span>
            </button>
          </h2>
        ) : null}
        {isExpanded ? (
          <ul
            id={sectionListId}
            className={styles.list}
            aria-labelledby={section.label ? sectionHeadingId : undefined}
          >
            {section.items.map((item) => {
              const active = isItemActive(pathname, item);

              return (
                <li key={item.key} className={styles.item}>
                  <Link
                    href={item.href}
                    className={[active ? 'button--active' : '', actionClassName]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={onItemSelect}
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
            {logoutSectionKey === section.key ? (
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
            ) : null}
          </ul>
        ) : null}
      </section>
    );
  };

  return (
    <nav id={navId} className={rootClassName} aria-label={navigationLabel}>
      <div className={styles.mainSection}>{resolvedMainSections.map(renderSection)}</div>

      <div className={styles.footerSection}>
        <div className={styles.footerContent}>{resolvedFooterSections.map(renderSection)}</div>
        {logoutSectionKey ? null : (
          <ul className={styles.list} aria-label={footerListLabel}>
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
        )}

        {showCollapseControl ? (
          <div className={styles.footerControls}>
            <button
              type="button"
              className={`${styles.action} ${styles.toggleButton} ${
                isCollapsed ? styles.actionCollapsed : ''
              } ${styles.collapseButton} button`}
              aria-pressed={isCollapsed}
              aria-label={isCollapsed ? expandLabel : collapseLabel}
              title={isCollapsed ? expandLabel : collapseLabel}
              onClick={() => {
                setCollapsed((current) => !current);
              }}
            >
              <span className={styles.icon} aria-hidden="true">
                {isCollapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
              </span>
              {!isCollapsed ? <span className={styles.label}>{collapseLabel}</span> : null}
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
