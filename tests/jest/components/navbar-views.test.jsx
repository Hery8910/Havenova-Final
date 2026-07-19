import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { NavbarDesktopView } from '../../../packages/components/client/navbar/NavbarDesktopView/NavbarDesktopView';
import { NavbarTabletView } from '../../../packages/components/client/navbar/NavbarTabletView/NavbarTabletView';
import { NavbarMobileView } from '../../../packages/components/client/navbar/NavbarMobileView/NavbarMobileView';
import { getNavbarContent } from '../../../packages/components/client/navbar/navbar.shared';

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

const texts = {
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

const auth = {
  authId: 'auth_1',
  userClientId: 'uc_1',
  userId: 'user_1',
  clientId: 'client_1',
  email: 'user@example.com',
  role: 'user',
  isLogged: true,
  isVerified: true,
  isNewUser: false,
};

function buildContent(authOverrides = auth) {
  return getNavbarContent({
    texts,
    navbarConfig: texts.components.client.navbar,
    auth: authOverrides,
  });
}

describe('Navbar views', () => {
  it('desktop view opens account navigation, navigates and logs out', async () => {
    const onNavigate = jest.fn();
    const onLogout = jest.fn().mockResolvedValue(undefined);

    render(
      <NavbarDesktopView content={buildContent()} onNavigate={onNavigate} onLogout={onLogout} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Work requests' }));

    expect(onNavigate).toHaveBeenCalledWith('/profile/work-requests');

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(onLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('desktop account trigger toggles, closes on Escape, and restores focus', async () => {
    render(
      <NavbarDesktopView
        content={buildContent()}
        onNavigate={jest.fn()}
        onLogout={jest.fn().mockResolvedValue(undefined)}
      />
    );

    const trigger = screen.getByRole('button', { name: 'Open account navigation' });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
    });
  });

  it('closes the account panel before delegating logout, preventing normal repeated activation', async () => {
    const onLogout = jest.fn().mockResolvedValue(undefined);
    render(
      <NavbarDesktopView content={buildContent()} onNavigate={jest.fn()} onLogout={onLogout} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    const logout = await screen.findByRole('button', { name: 'Logout' });
    fireEvent.click(logout);
    fireEvent.click(logout);

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('tablet view switches between menu and account panels and closes on outside click', async () => {
    const onNavigate = jest.fn();
    const onLogout = jest.fn().mockResolvedValue(undefined);

    render(
      <NavbarTabletView
        auth={auth}
        content={buildContent()}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Contact' }));
    expect(onNavigate).toHaveBeenCalledWith('/contact');

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));
    expect(await screen.findByRole('button', { name: 'Logout' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Contact' })).not.toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });
  });

  it('mobile view switches sections and renders preferences controls with icon-and-value mode', async () => {
    const onNavigate = jest.fn();
    const onLogout = jest.fn().mockResolvedValue(undefined);

    render(
      <NavbarMobileView
        auth={auth}
        content={buildContent()}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open services navigation' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Cleaning' }));
    expect(onNavigate).toHaveBeenCalledWith('/cleaning-service');

    fireEvent.click(screen.getByRole('button', { name: 'Open preferences navigation' }));
    expect(screen.getByTestId('theme-toggler')).toHaveAttribute('data-display', 'icon-with-value');
    expect(screen.getByTestId('language-switcher')).toHaveAttribute(
      'data-display',
      'icon-with-value'
    );
    expect(screen.getByTestId('language-switcher')).toHaveAttribute('data-presentation', 'modal');
  });

  it('mobile view shows guest account actions when the user is not logged in', async () => {
    const guestAuth = {
      ...auth,
      role: 'guest',
      isLogged: false,
      authId: '',
      userClientId: '',
      userId: '',
      email: '',
    };

    render(
      <NavbarMobileView
        auth={guestAuth}
        content={buildContent(guestAuth)}
        onNavigate={jest.fn()}
        onLogout={jest.fn().mockResolvedValue(undefined)}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open account navigation' }));

    expect(await screen.findByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });
});
