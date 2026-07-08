import type { JSX } from 'react';
import type { SideNavItemMatch, SideNavProps } from '../../../../sideNav';

export type ProfileNavIcon =
  | 'dashboard'
  | 'requests'
  | 'clients'
  | 'property-manager'
  | 'objects'
  | 'task-catalog'
  | 'employees'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'work-orders'
  | 'work-requests'
  | 'settings';

export interface ProfileNavLink {
  key: string;
  label: string;
  href: string;
  icon: ProfileNavIcon;
  match?: SideNavItemMatch;
}

export interface ProfileNavProps
  extends Pick<
    SideNavProps,
    'className' | 'collapseBreakpoint' | 'footerListLabel' | 'id' | 'initialCollapsed'
  > {
  mainItems?: ProfileNavLink[];
  footerItems?: ProfileNavLink[];
}

export interface ProfileNavLabels {
  overview: string;
  workOrders: string;
  workRequests: string;
  notifications: string;
  settings: string;
  logout: string;
  navigationLabel: string;
  mainListLabel: string;
  footerListLabel: string;
  collapse: string;
  expand: string;
}

export type ProfileNavIconMap = Record<ProfileNavIcon, JSX.Element>;
