import type { AuthUser } from '../../../types';
import type { NavbarAccessibilityConfig, NavbarConfig, NavLinkItem } from './navbar.types';

const DEFAULT_MENU_LINKS: NavLinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '/how-it-work' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
];

const DEFAULT_SERVICE_LINKS: NavLinkItem[] = [
  { label: 'Cleaning', href: '/cleaning-service' },
  { label: 'Maintenance', href: '/home-service' },
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

export interface ResolvedNavbarContent {
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
    theme: string;
    language: string;
  };
  a11y: ResolvedNavbarAccessibility;
}

export function getNavbarLogoSrc(theme: 'light' | 'dark') {
  return theme === 'dark' ? '/logos/nav-logo-dark.webp' : '/logos/nav-logo-light.webp';
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
    preferencesToggle:
      accessibility?.preferencesToggle ?? 'Open preferences navigation',
    menuPanel: accessibility?.menuPanel ?? 'Menu navigation panel',
    accountPanel: accessibility?.accountPanel ?? 'Account navigation panel',
    servicesPanel: accessibility?.servicesPanel ?? 'Services navigation panel',
    preferencesPanel:
      accessibility?.preferencesPanel ?? 'Preferences navigation panel',
    dragHandle: accessibility?.dragHandle ?? 'Navigation panel handle',
  };
}

export function getNavbarContent({
  texts,
  navbarConfig,
  auth,
}: {
  texts: any;
  navbarConfig?: NavbarConfig;
  auth: AuthUser;
}): ResolvedNavbarContent {
  const navbarTexts = texts?.components?.client?.navbar;
  const avatarTexts = texts?.components?.client?.avatar;
  const profileNavTexts = texts?.pages?.client?.user?.profileNav;
  const editThemeTexts = texts?.pages?.client?.user?.edit?.theme;
  const a11y = resolveAccessibility(navbarConfig?.accessibility ?? navbarTexts?.accessibility);

  const menuLinks = navbarConfig?.links ?? DEFAULT_MENU_LINKS;
  const serviceLinks = navbarConfig?.services ?? DEFAULT_SERVICE_LINKS;
  const primaryLinks = mergePrimaryLinks(menuLinks, serviceLinks);
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';

  const userLinks: NavLinkItem[] = auth.isLogged
    ? [
        { label: profileNavTexts?.profile ?? 'Profile', href: '/profile' },
        { label: profileNavTexts?.requests ?? 'Requests', href: '/profile/requests' },
        {
          label: profileNavTexts?.notifications ?? 'Notifications',
          href: '/profile/notification',
        },
        { label: profileNavTexts?.settings ?? 'Settings', href: '/profile/edit' },
      ]
    : [
        { label: registerLabel, href: '/user/register' },
        { label: loginLabel, href: '/user/login' },
      ];

  return {
    menuLinks,
    serviceLinks,
    primaryLinks,
    userLinks,
    labels: {
      menu: navbarConfig?.headers?.about ?? 'Menu',
      services: navbarConfig?.headers?.services ?? 'Services',
      profile: avatarTexts?.profile?.label ?? navbarTexts?.profile?.label ?? 'Profile',
      account: a11y.accountLabel,
      preferences: profileNavTexts?.settings ?? 'Preferences',
      theme: editThemeTexts?.theme ?? 'Theme',
      language: editThemeTexts?.lang ?? 'Language',
    },
    a11y,
  };
}
