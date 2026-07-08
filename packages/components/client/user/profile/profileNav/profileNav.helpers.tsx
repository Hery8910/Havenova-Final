'use client';

import type { JSX } from 'react';
import { FaBell, FaCog, FaListUl, FaUser } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';
import { GrUserManager, GrUserWorker } from 'react-icons/gr';
import {
  LuBookOpen,
  LuLayoutPanelTop,
  LuListChecks,
  LuMessagesSquare,
  LuUsers,
} from 'react-icons/lu';
import { PiBuildings } from 'react-icons/pi';

import { href } from '../../../../../utils/navigation';
import type { SideNavItem } from '../../../../sideNav';
import { PROFILE_NAV_FALLBACKS } from './profileNav.fallbacks';
import type { ProfileNavIcon, ProfileNavIconMap, ProfileNavLabels, ProfileNavLink } from './profileNav.types';

export const profileNavIconMap: ProfileNavIconMap = {
  dashboard: <LuLayoutPanelTop aria-hidden />,
  requests: <LuListChecks aria-hidden />,
  clients: <LuUsers aria-hidden />,
  'property-manager': <GrUserManager aria-hidden />,
  objects: <PiBuildings aria-hidden />,
  'task-catalog': <LuBookOpen aria-hidden />,
  employees: <GrUserWorker aria-hidden />,
  messages: <LuMessagesSquare aria-hidden />,
  notifications: <FaBell aria-hidden />,
  profile: <FaUser aria-hidden />,
  'work-orders': <FaBriefcase aria-hidden />,
  'work-requests': <FaListUl aria-hidden />,
  settings: <FaCog aria-hidden />,
};

export function resolveProfileNavLabels(texts: unknown): ProfileNavLabels {
  const sideNavTexts = (texts as {
    components?: {
      dashboard?: {
        sideNav?: {
          common?: Partial<ProfileNavLabels>;
          user?: {
            pages?: Partial<Pick<ProfileNavLabels, 'overview' | 'workOrders' | 'workRequests' | 'notifications'>>;
          };
        };
      };
    };
  })?.components?.dashboard?.sideNav;

  const commonTexts = sideNavTexts?.common;
  const userTexts = sideNavTexts?.user?.pages;

  return {
    overview: userTexts?.overview ?? PROFILE_NAV_FALLBACKS.overview,
    workOrders: userTexts?.workOrders ?? PROFILE_NAV_FALLBACKS.workOrders,
    workRequests: userTexts?.workRequests ?? PROFILE_NAV_FALLBACKS.workRequests,
    notifications: userTexts?.notifications ?? PROFILE_NAV_FALLBACKS.notifications,
    settings: commonTexts?.settings ?? PROFILE_NAV_FALLBACKS.settings,
    logout: commonTexts?.logout ?? PROFILE_NAV_FALLBACKS.logout,
    navigationLabel: commonTexts?.navigationLabel ?? PROFILE_NAV_FALLBACKS.navigationLabel,
    mainListLabel: commonTexts?.mainListLabel ?? PROFILE_NAV_FALLBACKS.mainListLabel,
    footerListLabel: commonTexts?.footerListLabel ?? PROFILE_NAV_FALLBACKS.footerListLabel,
    collapse: commonTexts?.collapse ?? PROFILE_NAV_FALLBACKS.collapse,
    expand: commonTexts?.expand ?? PROFILE_NAV_FALLBACKS.expand,
  };
}

export function buildDefaultProfileNavMainItems(
  lang: string,
  labels: ProfileNavLabels
): ProfileNavLink[] {
  return [
    {
      key: 'profile',
      label: labels.overview,
      href: href(lang, '/profile'),
      icon: 'profile',
      match: 'exact',
    },
    {
      key: 'work-orders',
      label: labels.workOrders,
      href: href(lang, '/profile/orders'),
      icon: 'work-orders',
      match: 'prefix',
    },
    {
      key: 'work-requests',
      label: labels.workRequests,
      href: href(lang, '/profile/requests'),
      icon: 'work-requests',
      match: 'prefix',
    },
    {
      key: 'notifications',
      label: labels.notifications,
      href: href(lang, '/profile/notifications'),
      icon: 'notifications',
      match: 'prefix',
    },
  ];
}

export function buildDefaultProfileNavFooterItems(
  lang: string,
  labels: ProfileNavLabels
): ProfileNavLink[] {
  return [
    {
      key: 'settings',
      label: labels.settings,
      href: href(lang, '/profile/settings'),
      icon: 'settings',
      match: 'prefix',
    },
  ];
}

export function toSideNavItems(items: ProfileNavLink[]): SideNavItem[] {
  return items.map((item) => ({
    ...item,
    icon: profileNavIconMap[item.icon],
  }));
}
