'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useMemo, useState, type JSX } from 'react';
import {
  LuActivity,
  LuBell,
  LuBookOpen,
  LuBriefcaseBusiness,
  LuBuilding2,
  LuCalendarDays,
  LuChartNoAxesCombined,
  LuChevronDown,
  LuChevronRight,
  LuClipboardList,
  LuCog,
  LuFileText,
  LuFolders,
  LuLayoutDashboard,
  LuLogOut,
  LuMessagesSquare,
  LuPalette,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuShield,
  LuSlidersHorizontal,
  LuSparkles,
  LuUsers,
  LuUserRoundCog,
  LuWrench,
} from 'react-icons/lu';

import { useAuth } from '../../../../../../../packages/contexts/auth/authContext';
import { useLang } from '../../../../../../../packages/hooks/useLang';
import {
  getDashboardNavSections,
  normalizeDashboardPathname,
  type DashboardShellIcon,
  type DashboardShellItem,
  type DashboardShellLang,
  type DashboardShellSection,
} from '../../dashboardShell';

const iconMap: Record<DashboardShellIcon, JSX.Element> = {
  overview: <LuLayoutDashboard aria-hidden="true" />,
  requests: <LuClipboardList aria-hidden="true" />,
  properties: <LuBuilding2 aria-hidden="true" />,
  clients: <LuUsers aria-hidden="true" />,
  admins: <LuUserRoundCog aria-hidden="true" />,
  workers: <LuBriefcaseBusiness aria-hidden="true" />,
  managers: <LuUsers aria-hidden="true" />,
  services: <LuSparkles aria-hidden="true" />,
  tasks: <LuBookOpen aria-hidden="true" />,
  templates: <LuFolders aria-hidden="true" />,
  automations: <LuChartNoAxesCombined aria-hidden="true" />,
  messages: <LuMessagesSquare aria-hidden="true" />,
  notifications: <LuBell aria-hidden="true" />,
  activity: <LuActivity aria-hidden="true" />,
  company: <LuBuilding2 aria-hidden="true" />,
  account: <LuUserRoundCog aria-hidden="true" />,
  general: <LuCog aria-hidden="true" />,
  branding: <LuPalette aria-hidden="true" />,
  contact: <LuMessagesSquare aria-hidden="true" />,
  legal: <LuFileText aria-hidden="true" />,
  operations: <LuWrench aria-hidden="true" />,
  integrations: <LuSlidersHorizontal aria-hidden="true" />,
  billing: <LuBookOpen aria-hidden="true" />,
  security: <LuShield aria-hidden="true" />,
  preferences: <LuCalendarDays aria-hidden="true" />,
};

type DashboardShellNavProps = {
  className?: string;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onItemSelect?: () => void;
  showCollapseControl?: boolean;
  presentation?: 'sidebar' | 'drawer';
};

function isItemActive(pathname: string, item: DashboardShellItem) {
  if (item.match === 'prefix') {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return pathname === item.href;
}

function getActiveSectionKey(pathname: string, sections: DashboardShellSection[]) {
  return sections.find((section) => section.items.some((item) => isItemActive(pathname, item)))
    ?.key;
}

function getNavLabels(lang: DashboardShellLang) {
  if (lang === 'es') {
    return {
      collapse: 'Contraer navegación',
      expand: 'Expandir navegación',
      logout: 'Cerrar sesión',
    };
  }

  if (lang === 'de') {
    return {
      collapse: 'Navigation einklappen',
      expand: 'Navigation ausklappen',
      logout: 'Abmelden',
    };
  }

  return {
    collapse: 'Collapse navigation',
    expand: 'Expand navigation',
    logout: 'Logout',
  };
}

export function DashboardShellNav({
  className,
  isCollapsed,
  onCollapsedChange,
  onItemSelect,
  showCollapseControl = true,
  presentation = 'sidebar',
}: DashboardShellNavProps) {
  const { logout } = useAuth();
  const lang = useLang() as DashboardShellLang;
  const pathname = normalizeDashboardPathname(usePathname() ?? `/${lang}`);
  const navigationId = useId().replace(/:/g, '');
  const shell = getDashboardNavSections(lang);
  const sections = useMemo(
    () => [...shell.mainSections, ...shell.footerSections],
    [shell.footerSections, shell.mainSections]
  );
  const activeSectionKey = getActiveSectionKey(pathname, sections);
  const [expandedSectionKey, setExpandedSectionKey] = useState<string | null>(
    () => activeSectionKey ?? shell.mainSections[0]?.key ?? null
  );
  const labels = getNavLabels(lang);

  useEffect(() => {
    setExpandedSectionKey((current) => {
      if (activeSectionKey) {
        return activeSectionKey;
      }

      if (current && sections.some((section) => section.key === current)) {
        return current;
      }

      return shell.mainSections[0]?.key ?? null;
    });
  }, [activeSectionKey, sections, shell.mainSections]);

  const renderSection = (section: DashboardShellSection, includesLogout = false) => {
    const isExpanded = expandedSectionKey === section.key;
    const headingId = `dashboard-navigation-${navigationId}-${section.key}-heading`;
    const listId = `dashboard-navigation-${navigationId}-${section.key}-items`;

    return (
      <section
        className="dashboard-navigation__group"
        key={section.key}
        aria-labelledby={headingId}
      >
        <h2 className="dashboard-navigation__heading">
          <button
            id={headingId}
            type="button"
            className="dashboard-navigation__group-toggle"
            aria-expanded={isExpanded}
            aria-controls={listId}
            aria-label={isCollapsed ? section.label : undefined}
            title={isCollapsed ? section.label : undefined}
            onClick={() => {
              setExpandedSectionKey((current) => (current === section.key ? null : section.key));
            }}
          >
            <span className="dashboard-navigation__group-toggle-main">
              <span className="dashboard-navigation__icon" aria-hidden="true">
                {iconMap[section.icon]}
              </span>
              {!isCollapsed ? <span>{section.label}</span> : null}
            </span>
            <span className="dashboard-navigation__disclosure" aria-hidden="true">
              {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
            </span>
          </button>
        </h2>

        {isExpanded ? (
          <ul id={listId} className="dashboard-navigation__list" aria-labelledby={headingId}>
            {section.items.map((item) => {
              const active = isItemActive(pathname, item);
              const href = item.href === '/' ? `/${lang}` : `/${lang}${item.href}`;

              return (
                <li className="dashboard-navigation__item" key={item.key}>
                  <Link
                    href={href}
                    className="dashboard-navigation__link"
                    data-active={active ? 'true' : undefined}
                    data-level={item.level ?? 0}
                    aria-current={active ? 'page' : undefined}
                    aria-label={item.label}
                    title={isCollapsed ? item.label : undefined}
                    onClick={onItemSelect}
                  >
                    <span className="dashboard-navigation__icon" aria-hidden="true">
                      {iconMap[item.icon]}
                    </span>
                    {!isCollapsed ? (
                      <span className="dashboard-navigation__label">{item.label}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
            {includesLogout ? (
              <li className="dashboard-navigation__item">
                <button
                  type="button"
                  className="dashboard-navigation__logout"
                  aria-label={labels.logout}
                  title={isCollapsed ? labels.logout : undefined}
                  onClick={logout}
                >
                  <span className="dashboard-navigation__icon" aria-hidden="true">
                    <LuLogOut />
                  </span>
                  {!isCollapsed ? (
                    <span className="dashboard-navigation__label">{labels.logout}</span>
                  ) : null}
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </section>
    );
  };

  return (
    <nav
      className={['dashboard-navigation', `dashboard-navigation--${presentation}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={shell.navigationLabel}
    >
      <div className="dashboard-navigation__main">
        {shell.mainSections.map((section) => renderSection(section))}
      </div>
      <div className="dashboard-navigation__footer">
        {shell.footerSections.map((section) => renderSection(section, section.key === 'account'))}
        {showCollapseControl ? (
          <button
            type="button"
            className="dashboard-navigation__collapse-control"
            aria-pressed={isCollapsed}
            aria-label={isCollapsed ? labels.expand : labels.collapse}
            title={isCollapsed ? labels.expand : labels.collapse}
            onClick={() => onCollapsedChange(!isCollapsed)}
          >
            <span className="dashboard-navigation__icon" aria-hidden="true">
              {isCollapsed ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
            </span>
            {!isCollapsed ? <span>{labels.collapse}</span> : null}
          </button>
        ) : null}
      </div>
    </nav>
  );
}
