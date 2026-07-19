import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { AdminProvider, useAdmin } from '../../../packages/contexts/admin/AdminContext';
import { defaultTestClient, renderWithAppProviders } from '../utils/test-providers';
import { getAdminProfile, updateAdminProfile } from '@havenova/services';

const mockUseAuth = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('../../../packages/contexts/auth/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@havenova/services', () => ({
  getAdminProfile: jest.fn(),
  updateAdminProfile: jest.fn(),
}));

const mockedGetAdminProfile = jest.mocked(getAdminProfile);
const mockedUpdateAdminProfile = jest.mocked(updateAdminProfile);

function AdminConsumer() {
  const { admin, source, isOffline, lastSyncAt } = useAdmin();

  return (
    <>
      <div data-testid="admin-email">{admin.email}</div>
      <div data-testid="admin-user-client-id">{admin.userClientId}</div>
      <div data-testid="admin-source">{source}</div>
      <div data-testid="admin-is-offline">{String(isOffline)}</div>
      <div data-testid="admin-last-sync-at">{lastSyncAt ?? ''}</div>
    </>
  );
}

function AdminThemeConsumer() {
  const { admin, setTheme } = useAdmin();

  return (
    <>
      <output data-testid="admin-theme">{admin.theme}</output>
      <button type="button" onClick={() => void setTheme('dark')}>
        Set dashboard dark theme
      </button>
    </>
  );
}

describe('AdminProvider', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
    mockUseAuth.mockReset();
    mockedGetAdminProfile.mockReset();
    mockedUpdateAdminProfile.mockReset();
    mockUseAuth.mockReturnValue({
      auth: {
        authId: '',
        userClientId: '',
        clientId: defaultTestClient._id,
        email: '',
        role: 'guest',
        isLogged: false,
        isVerified: false,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
    });
  });

  it('creates a guest admin complement with default source state', async () => {
    renderWithAppProviders(
      <AdminProvider>
        <AdminConsumer />
      </AdminProvider>
    );

    expect(await screen.findByTestId('admin-user-client-id')).toHaveTextContent('');
    expect(screen.getByTestId('admin-email')).toHaveTextContent('');
    expect(screen.getByTestId('admin-source')).toHaveTextContent('default');
    expect(screen.getByTestId('admin-is-offline')).toHaveTextContent('false');
    expect(screen.getByTestId('admin-last-sync-at')).toHaveTextContent('');
  });

  it('hydrates from server and records synchronization metadata', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'admin_uc_1',
        clientId: defaultTestClient._id,
        email: 'admin.session@example.com',
        role: 'admin',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
    });

    mockedGetAdminProfile.mockResolvedValue({
      userClientId: 'admin_uc_1',
      clientId: 'client_123',
      email: 'admin.profile@example.com',
      name: 'Admin',
      language: 'en',
      theme: 'light',
      createdAt: '',
      updatedAt: '',
    });

    renderWithAppProviders(
      <AdminProvider>
        <AdminConsumer />
      </AdminProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('admin-email')).toHaveTextContent('admin.profile@example.com');
    });
    expect(screen.getByTestId('admin-source')).toHaveTextContent('server');
    expect(screen.getByTestId('admin-is-offline')).toHaveTextContent('false');
    expect(screen.getByTestId('admin-last-sync-at')).not.toHaveTextContent('');
  });

  it('retries through refreshAuth after a protected fetch failure', async () => {
    const refreshAuth = jest.fn().mockResolvedValue({ syncedFromServer: true });

    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'admin_uc_1',
        clientId: defaultTestClient._id,
        email: 'admin.session@example.com',
        role: 'admin',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth,
    });

    const unauthorizedError = new Error('Unauthorized');
    unauthorizedError.response = {
      status: 401,
      data: { code: 'AUTH_ACCESS_TOKEN_MISSING' },
    };

    mockedGetAdminProfile.mockRejectedValueOnce(unauthorizedError).mockResolvedValueOnce({
      userClientId: 'admin_uc_1',
      clientId: 'client_123',
      email: 'admin.profile@example.com',
      name: 'Admin',
      language: 'en',
      theme: 'light',
      createdAt: '',
      updatedAt: '',
    });

    localStorage.setItem(
      'hv-admin:client_123:admin_uc_1',
      JSON.stringify({
        userClientId: 'admin_uc_1',
        clientId: 'client_123',
        email: 'admin.cached@example.com',
        name: 'Admin',
        language: 'en',
        theme: 'light',
        createdAt: '',
        updatedAt: '',
      })
    );

    renderWithAppProviders(
      <AdminProvider>
        <AdminConsumer />
      </AdminProvider>
    );

    await waitFor(() => {
      expect(refreshAuth).toHaveBeenCalledTimes(1);
    });
    expect(mockedGetAdminProfile.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
    [null, 'light'],
    ['system', 'light'],
  ])('resolves the Dashboard theme from stored %s as %s', async (storedTheme, expectedTheme) => {
    if (storedTheme) {
      localStorage.setItem('theme', storedTheme);
    }

    renderWithAppProviders(
      <AdminProvider>
        <AdminThemeConsumer />
      </AdminProvider>
    );

    expect(await screen.findByTestId('admin-theme')).toHaveTextContent(expectedTheme);
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', expectedTheme);
    });
  });

  it('owns Dashboard theme changes without mounting ThemeToggler', async () => {
    renderWithAppProviders(
      <AdminProvider>
        <AdminThemeConsumer />
      </AdminProvider>
    );

    expect(await screen.findByTestId('admin-theme')).toHaveTextContent('light');
    fireEvent.click(screen.getByRole('button', { name: 'Set dashboard dark theme' }));

    await waitFor(() => {
      expect(screen.getByTestId('admin-theme')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  it('keeps Dashboard theme state when local storage reads or writes fail', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    renderWithAppProviders(
      <AdminProvider>
        <AdminThemeConsumer />
      </AdminProvider>
    );

    expect(await screen.findByTestId('admin-theme')).toHaveTextContent('light');
    fireEvent.click(screen.getByRole('button', { name: 'Set dashboard dark theme' }));

    await waitFor(() => {
      expect(screen.getByTestId('admin-theme')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });
});
