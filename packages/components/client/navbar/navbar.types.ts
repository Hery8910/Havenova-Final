import type { IconType } from 'react-icons';

export interface BaseNavItem {
  label: string;
  href: string;
  icon?: IconType;
  img?: string;
  image?: string;
  alt?: string;
}

export interface IconNavItem extends BaseNavItem {
  image: string;
  alt: string;
}

export interface NavLinkItem extends BaseNavItem {}

export type ServiceNavItem = IconNavItem;

export interface SimpleNavItem extends BaseNavItem {}

export interface ProfileNavItem extends BaseNavItem {
  auth?: string;
}

export interface HeadersItem {
  services: string;
  about: string;
  profile: string;
}

export interface NavbarAccessibilityConfig {
  mainNavigation?: string;
  homeLink?: string;
  logoAlt?: string;
  accountLabel?: string;
  mobileNavigation?: string;
  mobileNavigationSections?: string;
  openMenu?: string;
  closeMenu?: string;
  profileToggle?: string;
  menuToggle?: string;
  servicesToggle?: string;
  preferencesToggle?: string;
  menuPanel?: string;
  accountPanel?: string;
  servicesPanel?: string;
  preferencesPanel?: string;
  dragHandle?: string;
}

export interface NavbarBrandingConfig {
  homeHref?: string;
  desktopLogoSrc?: string;
  mobileLogoSrc?: string;
  desktopLogoWidth?: number;
  desktopLogoHeight?: number;
  mobileLogoWidth?: number;
  mobileLogoHeight?: number;
}

export interface NavbarConfig {
  headers?: HeadersItem;
  links?: NavLinkItem[];
  services?: ServiceNavItem[];
  about?: SimpleNavItem[];
  profile?: ProfileNavItem;
  register?: ProfileNavItem[];
  accessibility?: NavbarAccessibilityConfig;
  branding?: NavbarBrandingConfig;
}
