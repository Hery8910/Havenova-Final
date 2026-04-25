import {
  FaBell,
  FaBuildingUser,
  FaClipboardList,
  FaListCheck,
  FaRegEnvelope,
  FaRegUser,
} from 'react-icons/fa6';
import { FaBroom, FaScrewdriverWrench } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi2';
import { RiBuilding2Line } from 'react-icons/ri';
import type { AuthUser } from '../../../types';
import type { Messages } from '@havenova/i18n';
import type { AppLanguage } from '../../../types';
import type {
  NavbarAccessibilityConfig,
  NavbarBrandingConfig,
  NavbarConfig,
  NavLinkItem,
} from './navbar.types';
import { FaCog } from 'react-icons/fa';

const DEFAULT_MENU_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/', icon: HiHome },
  { label: 'How it works', href: '/how-it-work', icon: FaBuildingUser },
  { label: 'Contact', href: '/contact', icon: FaRegEnvelope },
  { label: 'About', href: '/about', icon: RiBuilding2Line },
];

const DEFAULT_SERVICE_LINKS: NavLinkItem[] = [
  {
    label: 'Cleaning',
    href: '/cleaning-service',
    image: '/svg/cleaning.svg',
    alt: 'Cleaning service',
  },
  {
    label: 'Maintenance',
    href: '/home-service',
    image: '/svg/service.svg',
    alt: 'Maintenance service',
  },
];

export interface ResolvedNavbarAccessibility {
  mainNavigation: string;
  homeLink: string;
  logoAlt: string;
  accountLabel: string;
  mobileNavigation: string;
  mobileNavigationSections: string;
  openMenu: string;
  closeMenu: string;
  profileToggle: string;
  menuToggle: string;
  servicesToggle: string;
  preferencesToggle: string;
  menuPanel: string;
  accountPanel: string;
  servicesPanel: string;
  preferencesPanel: string;
  dragHandle: string;
}

export interface ResolvedNavbarBranding {
  homeHref: string;
  desktopLogoSrc: string;
  desktopLogoWidth: number;
  desktopLogoHeight: number;
  mobileLogoSrc: string;
  mobileLogoWidth: number;
  mobileLogoHeight: number;
}

export interface ResolvedNavbarSession {
  isLoggedIn: boolean;
  accountMenuTitle: string;
  logoutLabel: string;
}

export interface ResolvedNavbarLanguageOption {
  label: string;
  shortLabel: string;
  switchLabel: string;
}

export interface ResolvedNavbarLanguageSwitcher {
  title: string;
  openButtonLabel: string;
  closeButtonLabel: string;
  currentLanguageLabel: string;
  currentTag: string;
  options: Record<AppLanguage, ResolvedNavbarLanguageOption>;
}

export interface ResolvedNavbarThemeToggle {
  buttonLabel: string;
  darkMode: string;
  lightMode: string;
}

export interface ResolvedNavbarContent {
  branding: ResolvedNavbarBranding;
  menuLinks: NavLinkItem[];
  serviceLinks: NavLinkItem[];
  primaryLinks: NavLinkItem[];
  userLinks: NavLinkItem[];
  labels: {
    menu: string;
    services: string;
    profile: string;
    account: string;
    preferences: string;
  };
  preferences: {
    title: string;
    theme: string;
    language: string;
    themeToggle: ResolvedNavbarThemeToggle;
    languageSwitcher: ResolvedNavbarLanguageSwitcher;
  };
  session: ResolvedNavbarSession;
  a11y: ResolvedNavbarAccessibility;
}

function mergePrimaryLinks(menuLinks: NavLinkItem[], serviceLinks: NavLinkItem[]) {
  const seen = new Set<string>();

  return [...serviceLinks, ...menuLinks].filter((item) => {
    if (item.href === '/') {
      return false;
    }

    if (seen.has(item.href)) {
      return false;
    }

    seen.add(item.href);
    return true;
  });
}

function enrichLinks(configLinks: NavLinkItem[] | undefined, defaultLinks: NavLinkItem[]) {
  if (!configLinks?.length) {
    return defaultLinks;
  }

  return configLinks.map((item) => {
    const fallback = defaultLinks.find((defaultItem) => defaultItem.href === item.href);

    if (!fallback) {
      return item;
    }

    return {
      ...fallback,
      ...item,
      icon: item.icon ?? fallback.icon,
      img: item.img || fallback.img,
      image: item.image || fallback.image,
      alt: item.alt || fallback.alt,
    };
  });
}

function resolveAccessibility(
  accessibility: NavbarAccessibilityConfig | undefined
): ResolvedNavbarAccessibility {
  return {
    mainNavigation: accessibility?.mainNavigation ?? 'Main navigation',
    homeLink: accessibility?.homeLink ?? 'Go to homepage',
    logoAlt: accessibility?.logoAlt ?? 'Havenova logo',
    accountLabel: accessibility?.accountLabel ?? 'Account',
    mobileNavigation: accessibility?.mobileNavigation ?? 'Mobile navigation',
    mobileNavigationSections:
      accessibility?.mobileNavigationSections ?? 'Mobile navigation sections',
    openMenu: accessibility?.openMenu ?? 'Open menu',
    closeMenu: accessibility?.closeMenu ?? 'Close menu',
    profileToggle: accessibility?.profileToggle ?? 'Open account navigation',
    menuToggle: accessibility?.menuToggle ?? 'Open menu navigation',
    servicesToggle: accessibility?.servicesToggle ?? 'Open services navigation',
    preferencesToggle: accessibility?.preferencesToggle ?? 'Open preferences navigation',
    menuPanel: accessibility?.menuPanel ?? 'Menu navigation panel',
    accountPanel: accessibility?.accountPanel ?? 'Account navigation panel',
    servicesPanel: accessibility?.servicesPanel ?? 'Services navigation panel',
    preferencesPanel: accessibility?.preferencesPanel ?? 'Preferences navigation panel',
    dragHandle: accessibility?.dragHandle ?? 'Navigation panel handle',
  };
}

function resolveBranding(branding: NavbarBrandingConfig | undefined): ResolvedNavbarBranding {
  return {
    homeHref: branding?.homeHref ?? '/',
    desktopLogoSrc: branding?.desktopLogoSrc ?? '/logos/logo-dark.webp',
    desktopLogoWidth: branding?.desktopLogoWidth ?? 200,
    desktopLogoHeight: branding?.desktopLogoHeight ?? 50,
    mobileLogoSrc: branding?.mobileLogoSrc ?? '/logos/logo-small-dark.webp',
    mobileLogoWidth: branding?.mobileLogoWidth ?? 20,
    mobileLogoHeight: branding?.mobileLogoHeight ?? 20,
  };
}

export function getNavbarContent({
  texts,
  navbarConfig,
  auth,
}: {
  texts: Messages;
  navbarConfig?: NavbarConfig;
  auth: AuthUser;
}): ResolvedNavbarContent {
  const navbarTexts = texts?.components?.client?.navbar;
  const navbarAccountLinkTexts = navbarTexts?.accountLinks;
  const navbarPreferenceTexts = navbarTexts?.preferences;
  const a11y = resolveAccessibility(navbarConfig?.accessibility ?? navbarTexts?.accessibility);
  const branding = resolveBranding(navbarConfig?.branding);

  const menuLinks = enrichLinks(navbarConfig?.links, DEFAULT_MENU_LINKS);
  const serviceLinks = enrichLinks(navbarConfig?.services, DEFAULT_SERVICE_LINKS);
  const primaryLinks = mergePrimaryLinks(menuLinks, serviceLinks);
  const registerLabel = navbarTexts?.register?.[0]?.label ?? 'Register';
  const loginLabel = navbarTexts?.register?.[1]?.label ?? 'Login';

  const userLinks: NavLinkItem[] = auth.isLogged
    ? [
        {
          label: navbarAccountLinkTexts?.profile ?? 'Profile',
          href: '/profile',
          icon: FaRegUser,
        },
        {
          label: navbarAccountLinkTexts?.requests ?? 'Requests',
          href: '/profile/requests',
          icon: FaClipboardList,
        },
        {
          label: navbarAccountLinkTexts?.workRequests ?? 'Work requests',
          href: '/profile/work-requests',
          icon: FaListCheck,
        },
        {
          label: navbarAccountLinkTexts?.notifications ?? 'Notifications',
          href: '/profile/notifications',
          icon: FaBell,
        },
        {
          label: navbarAccountLinkTexts?.settings ?? 'Settings',
          href: '/profile/settings',
          icon: FaCog,
        },
      ]
    : [
        { label: registerLabel, href: '/user/register', icon: FaRegUser },
        { label: loginLabel, href: '/user/login', icon: FaRegUser },
      ];

  return {
    branding,
    menuLinks,
    serviceLinks,
    primaryLinks,
    userLinks,
    labels: {
      menu: navbarConfig?.headers?.about ?? 'Menu',
      services: navbarConfig?.headers?.services ?? 'Services',
      profile:
        navbarConfig?.headers?.profile ??
        navbarTexts?.headers?.profile ??
        navbarTexts?.profile?.label ??
        'Profile',
      account: a11y.accountLabel,
      preferences: navbarPreferenceTexts?.title ?? 'Preferences',
    },
    preferences: {
      title: navbarPreferenceTexts?.title ?? 'Preferences',
      theme: navbarPreferenceTexts?.theme ?? 'Theme',
      language: navbarPreferenceTexts?.language ?? 'Language',
      themeToggle: {
        buttonLabel: navbarPreferenceTexts?.themeToggle?.buttonLabel ?? 'Theme',
        darkMode: navbarPreferenceTexts?.themeToggle?.darkMode ?? 'Dark mode',
        lightMode: navbarPreferenceTexts?.themeToggle?.lightMode ?? 'Light mode',
      },
      languageSwitcher: {
        title: navbarTexts?.languageSwitcher?.title ?? 'Language',
        openButtonLabel: navbarTexts?.languageSwitcher?.openButtonLabel ?? 'Open language selector',
        closeButtonLabel:
          navbarTexts?.languageSwitcher?.closeButtonLabel ?? 'Close language selector',
        currentLanguageLabel:
          navbarTexts?.languageSwitcher?.currentLanguageLabel ?? 'Current language',
        currentTag: navbarTexts?.languageSwitcher?.currentTag ?? 'Current',
        options: {
          de: {
            label: navbarTexts?.languageSwitcher?.options?.de?.label ?? 'Deutsch',
            shortLabel: navbarTexts?.languageSwitcher?.options?.de?.shortLabel ?? 'DE',
            switchLabel:
              navbarTexts?.languageSwitcher?.options?.de?.switchLabel ??
              'Switch language to German',
          },
          en: {
            label: navbarTexts?.languageSwitcher?.options?.en?.label ?? 'English',
            shortLabel: navbarTexts?.languageSwitcher?.options?.en?.shortLabel ?? 'EN',
            switchLabel:
              navbarTexts?.languageSwitcher?.options?.en?.switchLabel ??
              'Switch language to English',
          },
          es: {
            label: navbarTexts?.languageSwitcher?.options?.es?.label ?? 'Español',
            shortLabel: navbarTexts?.languageSwitcher?.options?.es?.shortLabel ?? 'ES',
            switchLabel:
              navbarTexts?.languageSwitcher?.options?.es?.switchLabel ??
              'Switch language to Spanish',
          },
        },
      },
    },
    session: {
      isLoggedIn: auth.isLogged,
      accountMenuTitle: texts?.components?.client?.navbar?.accountMenuTitle ?? a11y.accountLabel,
      logoutLabel: navbarTexts?.session?.logoutLabel ?? 'Logout',
    },
    a11y,
  };
}
