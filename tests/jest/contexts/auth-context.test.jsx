import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import { AuthProvider, useAuth } from '../../../packages/contexts/auth/authContext';
import { defaultTestClient, renderWithAppProviders } from '../utils/test-providers';
import { getAuthUser, refreshToken } from '@havenova/services';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock('@havenova/services', () => ({
  clearCsrfToken: jest.fn(),
  getAuthUser: jest.fn(),
  getCsrfDebugState: jest.fn(() => ({ hasInMemoryCsrfToken: false })),
  getCsrfToken: jest.fn(() => 'test-csrf-token'),
  logoutUser: jest.fn(),
  refreshToken: jest.fn(),
}));

function AuthConsumer() {
  const { auth, source, isOffline } = useAuth();

  return (
    <>
      <div data-testid="auth-id">{auth.authId}</div>
      <div data-testid="user-client-id">{auth.userClientId}</div>
      <div data-testid="client-id">{auth.clientId}</div>
      <div data-testid="role">{auth.role}</div>
      <div data-testid="is-logged">{String(auth.isLogged)}</div>
      <div data-testid="email">{auth.email}</div>
      <div data-testid="source">{source}</div>
      <div data-testid="is-offline">{String(isOffline)}</div>
    </>
  );
}

const mockedGetAuthUser = jest.mocked(getAuthUser);
const mockedRefreshToken = jest.mocked(refreshToken);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
    mockedGetAuthUser.mockReset();
    mockedRefreshToken.mockReset();
  });

  it('creates a guest session normalized to the new auth shape', async () => {
    renderWithAppProviders(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('client-id')).toHaveTextContent('client_123');
    expect(screen.getByTestId('auth-id')).toHaveTextContent('');
    expect(screen.getByTestId('user-client-id')).toHaveTextContent('');
    expect(screen.getByTestId('role')).toHaveTextContent('guest');
    expect(screen.getByTestId('is-logged')).toHaveTextContent('false');
    expect(screen.getByTestId('source')).toHaveTextContent('default');
  });

  it('hydrates the persisted auth state using userClientId as canonical identity', async () => {
    localStorage.setItem(
      'hv-auth',
      JSON.stringify({
        userClientId: 'uc_1',
        clientId: 'client_123',
        email: 'user@example.com',
        role: 'guest',
        isLogged: false,
        isVerified: false,
      })
    );

    renderWithAppProviders(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('user-client-id')).toHaveTextContent('uc_1');
    expect(screen.getByTestId('email')).toHaveTextContent('user@example.com');
    expect(screen.getByTestId('source')).toHaveTextContent('storage');
  });

  it('keeps the cached authenticated session when auth bootstrap times out', async () => {
    localStorage.setItem(
      'hv-auth',
      JSON.stringify({
        authId: 'auth_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        email: 'user@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      })
    );

    mockedGetAuthUser.mockImplementation(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth bootstrap timed out.')), 0);
        })
    );

    renderWithAppProviders(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('user-client-id')).toHaveTextContent('uc_1');
    expect(screen.getByTestId('is-logged')).toHaveTextContent('true');
    expect(screen.getByTestId('source')).toHaveTextContent('storage');
  });

  it('creates a local development fallback session when there is no cache and the backend is offline', async () => {
    mockedGetAuthUser.mockRejectedValue(new Error('Network failed'));

    renderWithAppProviders(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId('source')).toHaveTextContent('dev-fallback');
    });
    expect(screen.getByTestId('is-logged')).toHaveTextContent('true');
    expect(screen.getByTestId('user-client-id')).toHaveTextContent('dev-user');
    expect(screen.getByTestId('email')).toHaveTextContent('dev.user@havenova.local');
    expect(screen.getByTestId('is-offline')).toHaveTextContent('true');
  });

  it('refreshes the authenticated session through refresh-token after a protected bootstrap failure', async () => {
    localStorage.setItem(
      'hv-auth',
      JSON.stringify({
        authId: 'auth_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        email: 'user@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      })
    );

    const unauthorizedError = new Error('Unauthorized');
    unauthorizedError.response = {
      status: 401,
      data: { code: 'AUTH_ACCESS_TOKEN_EXPIRED' },
    };

    mockedGetAuthUser
      .mockRejectedValueOnce(unauthorizedError)
      .mockResolvedValueOnce({
        authId: 'auth_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        email: 'user@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      });
    mockedRefreshToken.mockResolvedValue(undefined);

    renderWithAppProviders(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    await waitFor(() => {
      expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('source')).toHaveTextContent('server');
    expect(screen.getByTestId('is-logged')).toHaveTextContent('true');
  });
});
