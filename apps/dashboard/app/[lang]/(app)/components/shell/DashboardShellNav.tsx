'use client';

import type { JSX } from 'react';
import {
  LuActivity,
  LuBell,
  LuBookOpen,
  LuBriefcaseBusiness,
  LuBuilding2,
  LuCalendarDays,
  LuChartNoAxesCombined,
  LuClipboardList,
  LuCog,
  LuFileText,
  LuFolders,
  LuLayoutDashboard,
  LuMessagesSquare,
  LuPalette,
  LuShield,
  LuSlidersHorizontal,
  LuSparkles,
  LuUsers,
  LuUserRoundCog,
  LuWrench,
} from 'react-icons/lu';

import { useAuth } from '../../../../../../../packages/contexts';
import { useLang } from '../../../../../../../packages/hooks';

import {
  getDashboardNavSections,
  type DashboardShellIcon,
  type DashboardShellItem,
  type DashboardShellLang,
} from '../../dashboardShell';
import { SideNav, SideNavItem, SideNavSection } from '../../../../../../../packages/components';

const iconMap: Record<DashboardShellIcon, JSX.Element> = {
  overview: <LuLayoutDashboard aria-hidden />,
  requests: <LuClipboardList aria-hidden />,
  properties: <LuBuilding2 aria-hidden />,
  clients: <LuUsers aria-hidden />,
  admins: <LuUserRoundCog aria-hidden />,
  workers: <LuBriefcaseBusiness aria-hidden />,
  managers: <LuUsers aria-hidden />,
  services: <LuSparkles aria-hidden />,
  tasks: <LuBookOpen aria-hidden />,
  templates: <LuFolders aria-hidden />,
  automations: <LuChartNoAxesCombined aria-hidden />,
  messages: <LuMessagesSquare aria-hidden />,
  notifications: <LuBell aria-hidden />,
  activity: <LuActivity aria-hidden />,
  company: <LuBuilding2 aria-hidden />,
  account: <LuUserRoundCog aria-hidden />,
  general: <LuCog aria-hidden />,
  branding: <LuPalette aria-hidden />,
  contact: <LuMessagesSquare aria-hidden />,
  legal: <LuFileText aria-hidden />,
  operations: <LuWrench aria-hidden />,
  integrations: <LuSlidersHorizontal aria-hidden />,
  billing: <LuBookOpen aria-hidden />,
  security: <LuShield aria-hidden />,
  preferences: <LuCalendarDays aria-hidden />,
};

const DEFAULT_EXPANDED_SECTION_KEYS = ['workspace'];

function toSideNavItem(item: DashboardShellItem, lang: DashboardShellLang): SideNavItem {
  return {
    ...item,
    href: item.href === '/' ? `/${lang}` : `/${lang}${item.href}`,
    icon: iconMap[item.icon],
  };
}

function toSideNavSection(
  section: {
    key: string;
    label: string;
    icon: DashboardShellIcon;
    items: DashboardShellItem[];
  },
  lang: DashboardShellLang
): SideNavSection {
  return {
    key: section.key,
    label: section.label,
    icon: iconMap[section.icon],
    items: section.items.map((item) => toSideNavItem(item, lang)),
  };
}

type DashboardShellNavProps = {
  className?: string;
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onItemSelect?: () => void;
  showCollapseControl?: boolean;
  presentation?: 'sidebar' | 'drawer';
};

export function DashboardShellNav({
  className,
  isCollapsed,
  onCollapsedChange,
  onItemSelect,
  showCollapseControl,
  presentation,
}: DashboardShellNavProps) {
  const { logout } = useAuth();
  const lang = useLang() as DashboardShellLang;
  const shell = getDashboardNavSections(lang);

  return (
    <SideNav
      className={className}
      mainItems={[]}
      footerItems={[]}
      mainSections={shell.mainSections.map((section) => toSideNavSection(section, lang))}
      footerSections={shell.footerSections.map((section) => toSideNavSection(section, lang))}
      initialExpandedSectionKeys={DEFAULT_EXPANDED_SECTION_KEYS}
      logoutSectionKey="account"
      onLogout={logout}
      logoutLabel={lang === 'es' ? 'Cerrar sesión' : lang === 'de' ? 'Abmelden' : 'Logout'}
      navigationLabel={shell.navigationLabel}
      isCollapsed={isCollapsed}
      onCollapsedChange={onCollapsedChange}
      onItemSelect={onItemSelect}
      showCollapseControl={showCollapseControl}
      presentation={presentation}
      collapseLabel={
        lang === 'es'
          ? 'Contraer navegación'
          : lang === 'de'
            ? 'Navigation einklappen'
            : 'Collapse navigation'
      }
      expandLabel={
        lang === 'es'
          ? 'Expandir navegación'
          : lang === 'de'
            ? 'Navigation ausklappen'
            : 'Expand navigation'
      }
      footerListLabel={
        lang === 'es'
          ? 'Acciones de sesión'
          : lang === 'de'
            ? 'Sitzungsaktionen'
            : 'Session actions'
      }
    />
  );
}
