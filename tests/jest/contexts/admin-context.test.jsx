import React from 'react';
import { screen, waitFor } from '@testing-library/react';

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

describe('AdminProvider', () => {
  beforeEach(() => {
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

    mockedGetAdminProfile
      .mockRejectedValueOnce(unauthorizedError)
      .mockResolvedValueOnce({
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
});
