import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { NavbarContainer } from '../../../packages/components/client/navbar/NavbarContainer';
import { ProfileContext } from '../../../packages/contexts/profile/ProfileContext';

const mockPush = jest.fn();
const mockLogout = jest.fn().mockResolvedValue(undefined);
const mockUseDeviceSize = jest.fn();
const mockUseAuth = jest.fn();
const mockUseI18n = jest.fn();
const mockUseLang = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/en',
}));

jest.mock('@havenova/contexts/i18n', () => ({
  useI18n: () => mockUseI18n(),
}));

jest.mock('@havenova/hooks/useLang', () => ({
  useLang: () => mockUseLang(),
}));

jest.mock('../../../packages/contexts/auth/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../../../packages/components/client/navbar/hooks/useDeviceSize', () => ({
  useDeviceSize: () => mockUseDeviceSize(),
}));

jest.mock('../../../packages/components/themeToggler/ThemeToggler', () => ({
  __esModule: true,
  default: ({ display = 'icon', labels }) => (
    <button
      type="button"
      data-testid="theme-toggler"
      data-display={display}
      data-label={labels?.buttonLabel ?? ''}
    >
      theme
    </button>
  ),
}));

jest.mock('../../../packages/components/languageSwitcher/LanguageSwitcher', () => ({
  __esModule: true,
  default: ({ triggerDisplay = 'icon', presentation = 'dropdown', labels }) => (
    <button
      type="button"
      data-testid="language-switcher"
      data-display={triggerDisplay}
      data-presentation={presentation}
      data-label={labels?.title ?? ''}
    >
      language
    </button>
  ),
}));

const navbarTexts = {
  components: {
    client: {
      navbar: {
        accountMenuTitle: 'User account',
        session: {
          logoutLabel: 'Logout',
        },
        languageSwitcher: {
          title: 'Language',
          openButtonLabel: 'Open language selector',
          closeButtonLabel: 'Close language selector',
          currentLanguageLabel: 'Current language',
          options: {
            de: { label: 'Deutsch', shortLabel: 'DE', switchLabel: 'Switch language to German' },
            en: { label: 'English', shortLabel: 'EN', switchLabel: 'Switch language to English' },
            es: { label: 'Español', shortLabel: 'ES', switchLabel: 'Switch language to Spanish' },
          },
        },
        preferences: {
          title: 'Preferences',
          theme: 'Theme',
          language: 'Language',
          themeToggle: {
            buttonLabel: 'Theme',
            darkMode: 'Dark mode',
            lightMode: 'Light mode',
          },
        },
        accountLinks: {
          profile: 'Profile',
          requests: 'Requests',
          workRequests: 'Work requests',
          notifications: 'Notifications',
          settings: 'Settings',
        },
        headers: {
          services: 'Services',
          about: 'Menu',
          profile: 'Profile',
        },
        links: [
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ],
        services: [
          { label: 'Cleaning', href: '/cleaning-service', image: '/svg/cleaning.svg', alt: '' },
          { label: 'Maintenance', href: '/home-service', image: '/svg/service.svg', alt: '' },
        ],
        profile: {
          label: 'Profile',
          href: '/user/profile',
        },
        register: [
          { label: 'Register', href: '/user/register' },
          { label: 'Log in', href: '/user/login' },
        ],
        accessibility: {
          mainNavigation: 'Main navigation',
          homeLink: 'Go to homepage',
          logoAlt: 'Havenova logo',
          accountLabel: 'Account',
          mobileNavigation: 'Mobile navigation',
          mobileNavigationSections: 'Mobile navigation sections',
          openMenu: 'Open menu',
          closeMenu: 'Close menu',
          profileToggle: 'Open account navigation',
          menuToggle: 'Open menu navigation',
          servicesToggle: 'Open services navigation',
          preferencesToggle: 'Open preferences navigation',
          menuPanel: 'Menu navigation panel',
          accountPanel: 'Account navigation panel',
          servicesPanel: 'Services navigation panel',
          preferencesPanel: 'Preferences navigation panel',
          dragHandle: 'Navigation panel handle',
        },
      },
    },
  },
};

function setup({
  deviceSize = 'desktop',
  authOverrides = {},
  profile = { id: 'profile_1' },
  texts = navbarTexts,
} = {}) {
  mockPush.mockReset();
  mockLogout.mockClear();
  mockUseDeviceSize.mockReturnValue(deviceSize);
  mockUseLang.mockReturnValue('en');
  mockUseI18n.mockReturnValue({ texts });
  mockUseAuth.mockReturnValue({
    auth: {
      authId: 'auth_1',
      userClientId: 'uc_1',
      userId: 'user_1',
      clientId: 'client_1',
      email: 'user@example.com',
      role: 'user',
      isLogged: true,
      isVerified: true,
      isNewUser: false,
      ...authOverrides,
    },
    logout: mockLogout,
  });

  return render(
    <ProfileContext.Provider value={{ profile }}>
      <NavbarContainer />
    </ProfileContext.Provider>
  );
}

describe('NavbarContainer', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders a placeholder while device size is unresolved', () => {
    setup({ deviceSize: null });

    const nav = screen.getByRole('navigation', { hidden: true });
    expect(nav).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders desktop variant and navigates with the current language prefix', async () => {
    setup({ deviceSize: 'desktop' });

    fireEvent.click(screen.getByRole('button', { name: 'Contact' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/contact');
    });

    expect(screen.getByTestId('theme-toggler')).toHaveAttribute('data-display', 'icon');
    expect(screen.getByTestId('language-switcher')).toHaveAttribute('data-display', 'icon');
  });

  it('opens the desktop account menu, includes work requests, and closes on outside click', async () => {
    setup({ deviceSize: 'desktop' });

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));

    const workRequestsButton = screen.getByRole('button', { name: 'Work requests' });
    expect(workRequestsButton).toBeInTheDocument();

    fireEvent.click(workRequestsButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/en/profile/work-requests');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Profile' })).not.toBeInTheDocument();
    });
  });

  it('renders the tablet variant and keeps utility controls as icon-only buttons', () => {
    setup({ deviceSize: 'tablet' });

    expect(screen.getByTestId('theme-toggler')).toHaveAttribute('data-display', 'icon');
    expect(screen.getByTestId('language-switcher')).toHaveAttribute('data-display', 'icon');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('renders mobile preferences with icon-and-value controls', () => {
    setup({ deviceSize: 'mobile' });

    fireEvent.click(screen.getByRole('button', { name: 'Open preferences navigation' }));

    expect(screen.getByTestId('theme-toggler')).toHaveAttribute('data-display', 'icon-with-value');
    expect(screen.getByTestId('language-switcher')).toHaveAttribute(
      'data-display',
      'icon-with-value'
    );
    expect(screen.getByTestId('language-switcher')).toHaveAttribute(
      'data-presentation',
      'modal'
    );
  });

  it('closes the mobile preferences panel on Escape', async () => {
    setup({ deviceSize: 'mobile' });

    const preferencesToggle = screen.getByRole('button', { name: 'Open preferences navigation' });

    fireEvent.click(preferencesToggle);
    expect(screen.getByTestId('theme-toggler')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(preferencesToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('shows logout in the mobile account panel and calls logout', async () => {
    setup({ deviceSize: 'mobile' });

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('shows register/login instead of logout for guest users in the mobile account panel', () => {
    setup({
      deviceSize: 'mobile',
      authOverrides: {
        role: 'guest',
        isLogged: false,
        authId: '',
        userClientId: '',
        userId: '',
        email: '',
      },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));

    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });
});
