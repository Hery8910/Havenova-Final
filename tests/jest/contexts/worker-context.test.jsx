import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import { WorkerProvider, useWorker } from '../../../packages/contexts/worker/WorkerContext';
import { defaultTestClient, renderWithAppProviders } from '../utils/test-providers';
import { getWorkerProfile, updateWorkerProfile } from '@havenova/services';

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
  getWorkerProfile: jest.fn(),
  updateWorkerProfile: jest.fn(),
}));

const mockedGetWorkerProfile = jest.mocked(getWorkerProfile);
const mockedUpdateWorkerProfile = jest.mocked(updateWorkerProfile);

function WorkerConsumer() {
  const { worker, source, isOffline, lastSyncAt } = useWorker();

  return (
    <>
      <div data-testid="worker-email">{worker.email}</div>
      <div data-testid="worker-user-client-id">{worker.userClientId}</div>
      <div data-testid="worker-source">{source}</div>
      <div data-testid="worker-is-offline">{String(isOffline)}</div>
      <div data-testid="worker-last-sync-at">{lastSyncAt ?? ''}</div>
    </>
  );
}

describe('WorkerProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseAuth.mockReset();
    mockedGetWorkerProfile.mockReset();
    mockedUpdateWorkerProfile.mockReset();
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

  it('creates a guest worker complement with default source state', async () => {
    renderWithAppProviders(
      <WorkerProvider>
        <WorkerConsumer />
      </WorkerProvider>
    );

    expect(await screen.findByTestId('worker-user-client-id')).toHaveTextContent('');
    expect(screen.getByTestId('worker-email')).toHaveTextContent('');
    expect(screen.getByTestId('worker-source')).toHaveTextContent('default');
    expect(screen.getByTestId('worker-is-offline')).toHaveTextContent('false');
    expect(screen.getByTestId('worker-last-sync-at')).toHaveTextContent('');
  });

  it('hydrates from storage and marks the context offline when the backend is unavailable', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'worker_uc_1',
        clientId: defaultTestClient._id,
        email: 'worker.session@example.com',
        role: 'worker',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
    });

    localStorage.setItem(
      'hv-worker:client_123:worker_uc_1',
      JSON.stringify({
        userClientId: 'worker_uc_1',
        clientId: 'client_123',
        email: 'worker.cached@example.com',
        name: 'Worker',
        language: 'es',
        theme: 'light',
        createdAt: '',
        updatedAt: '',
      })
    );

    mockedGetWorkerProfile.mockRejectedValue(new Error('Network failed'));

    renderWithAppProviders(
      <WorkerProvider>
        <WorkerConsumer />
      </WorkerProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('worker-source')).toHaveTextContent('storage');
    });
    expect(screen.getByTestId('worker-email')).toHaveTextContent('worker.cached@example.com');
    expect(screen.getByTestId('worker-is-offline')).toHaveTextContent('true');
  });

  it('retries through refreshAuth after a protected fetch failure', async () => {
    const refreshAuth = jest.fn().mockResolvedValue({ syncedFromServer: true });

    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'worker_uc_1',
        clientId: defaultTestClient._id,
        email: 'worker.session@example.com',
        role: 'worker',
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

    mockedGetWorkerProfile
      .mockRejectedValueOnce(unauthorizedError)
      .mockResolvedValueOnce({
        userClientId: 'worker_uc_1',
        clientId: 'client_123',
        email: 'worker.profile@example.com',
        name: 'Worker',
        language: 'en',
        theme: 'light',
        createdAt: '',
        updatedAt: '',
      });

    localStorage.setItem(
      'hv-worker:client_123:worker_uc_1',
      JSON.stringify({
        userClientId: 'worker_uc_1',
        clientId: 'client_123',
        email: 'worker.cached@example.com',
        name: 'Worker',
        language: 'en',
        theme: 'light',
        createdAt: '',
        updatedAt: '',
      })
    );

    renderWithAppProviders(
      <WorkerProvider>
        <WorkerConsumer />
      </WorkerProvider>
    );

    await waitFor(() => {
      expect(refreshAuth).toHaveBeenCalledTimes(1);
    });
    expect(mockedGetWorkerProfile.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
