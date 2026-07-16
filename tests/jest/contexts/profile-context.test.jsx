import React from 'react';
import { screen, waitFor } from '@testing-library/react';

import { ProfileProvider, useProfile } from '../../../packages/contexts/profile/ProfileContext';
import { defaultTestClient, renderWithAppProviders } from '../utils/test-providers';
import { createUserClientProfile, getUserClientProfile } from '@havenova/services';

const mockUseAuth = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../packages/contexts/auth/authContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@havenova/services', () => ({
  getUserClientProfile: jest.fn(),
  updateUserClientProfile: jest.fn(),
  createUserClientProfile: jest.fn(),
}));

const mockedGetUserClientProfile = jest.mocked(getUserClientProfile);
const mockedCreateUserClientProfile = jest.mocked(createUserClientProfile);

function ProfileConsumer() {
  const { profile, source, isOffline } = useProfile();

  return (
    <>
      <div data-testid="profile-client-id">{profile.clientId}</div>
      <div data-testid="profile-user-client-id">{profile.userClientId}</div>
      <div data-testid="profile-contact-email">{profile.contactEmail}</div>
      <div data-testid="profile-source">{source}</div>
      <div data-testid="profile-is-offline">{String(isOffline)}</div>
    </>
  );
}

describe('ProfileProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUseAuth.mockReset();
    mockedGetUserClientProfile.mockReset();
    mockedCreateUserClientProfile.mockReset();
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
      setAuth: jest.fn(),
    });
  });

  it('creates a guest profile with explicit empty contactEmail', async () => {
    renderWithAppProviders(
      <ProfileProvider>
        <ProfileConsumer />
      </ProfileProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('profile-client-id')).toHaveTextContent('client_123');
    expect(screen.getByTestId('profile-contact-email')).toHaveTextContent('');
    expect(screen.getByTestId('profile-source')).toHaveTextContent('default');
  });

  it('preserves contactEmail from stored profile state when auth identity exists', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'uc_1',
        clientId: defaultTestClient._id,
        email: 'session@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
      setAuth: jest.fn(),
    });

    localStorage.setItem(
      'hv-profile:client_123:uc_1',
      JSON.stringify({
        _id: 'profile_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        contactEmail: 'profile@example.com',
        savedAddresses: [],
        language: 'en',
        theme: 'light',
        notificationPreferences: {
          inApp: { enabled: true, required: true },
          email: {
            important: { enabled: true, required: true },
            reminders: { enabled: false },
            promotional: { enabled: false },
          },
        },
        createdAt: '',
        updatedAt: '',
      })
    );

    mockedGetUserClientProfile.mockResolvedValue({
      _id: 'profile_1',
      userClientId: 'uc_1',
      clientId: 'client_123',
      contactEmail: 'profile@example.com',
      savedAddresses: [],
      language: 'en',
      theme: 'light',
      notificationPreferences: {
        inApp: { enabled: true, required: true },
        email: {
          important: { enabled: true, required: true },
          reminders: { enabled: false },
          promotional: { enabled: false },
        },
      },
      createdAt: '',
      updatedAt: '',
    });

    renderWithAppProviders(
      <ProfileProvider>
        <ProfileConsumer />
      </ProfileProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('profile-contact-email')).toHaveTextContent(
      'profile@example.com'
    );
    expect(screen.getByTestId('profile-user-client-id')).toHaveTextContent('uc_1');
    expect(screen.getByTestId('profile-source')).toHaveTextContent('server');
  });

  it('creates the backend profile automatically after a 404 for an authenticated user', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_1',
        userClientId: 'uc_1',
        clientId: defaultTestClient._id,
        email: 'session@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
      setAuth: jest.fn(),
    });

    const notFoundError = new Error('Profile fetch failed');
    notFoundError.response = {
      status: 404,
      data: { code: 'USER_CLIENT_PROFILE_NOT_FOUND' },
    };

    mockedGetUserClientProfile.mockRejectedValue(notFoundError);
    mockedCreateUserClientProfile.mockResolvedValue({
      success: true,
      code: 'USER_CLIENT_PROFILE_CREATED',
      profile: {
        _id: 'profile_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        contactEmail: 'profile@example.com',
        savedAddresses: [],
        profileImage: '/avatars/avatar-1.png',
        language: 'de',
        theme: 'light',
        notificationPreferences: {
          inApp: { enabled: true, required: true },
          email: {
            important: { enabled: true, required: true },
            reminders: { enabled: false },
            promotional: { enabled: false },
          },
        },
        extra: {},
        createdAt: '',
        updatedAt: '',
      },
    });

    renderWithAppProviders(
      <ProfileProvider>
        <ProfileConsumer />
      </ProfileProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-contact-email')).toHaveTextContent('profile@example.com');
    });
    expect(mockedCreateUserClientProfile).toHaveBeenCalledTimes(1);
  });

  it('hydrates different local caches per authenticated user inside the same client', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'auth_2',
        userClientId: 'uc_2',
        clientId: defaultTestClient._id,
        email: 'session@example.com',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
      setAuth: jest.fn(),
    });

    localStorage.setItem(
      'hv-profile:client_123:uc_1',
      JSON.stringify({
        _id: 'profile_1',
        userClientId: 'uc_1',
        clientId: 'client_123',
        contactEmail: 'user1@example.com',
        savedAddresses: [],
        language: 'en',
        theme: 'light',
        notificationPreferences: {
          inApp: { enabled: true, required: true },
          email: {
            important: { enabled: true, required: true },
            reminders: { enabled: false },
            promotional: { enabled: false },
          },
        },
        createdAt: '',
        updatedAt: '',
      })
    );
    localStorage.setItem(
      'hv-profile:client_123:uc_2',
      JSON.stringify({
        _id: 'profile_2',
        userClientId: 'uc_2',
        clientId: 'client_123',
        contactEmail: 'user2@example.com',
        savedAddresses: [],
        language: 'es',
        theme: 'light',
        notificationPreferences: {
          inApp: { enabled: true, required: true },
          email: {
            important: { enabled: true, required: true },
            reminders: { enabled: false },
            promotional: { enabled: false },
          },
        },
        createdAt: '',
        updatedAt: '',
      })
    );

    mockedGetUserClientProfile.mockRejectedValue(new Error('Network failed'));

    renderWithAppProviders(
      <ProfileProvider>
        <ProfileConsumer />
      </ProfileProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    expect(await screen.findByTestId('profile-contact-email')).toHaveTextContent(
      'user2@example.com'
    );
    expect(screen.getByTestId('profile-user-client-id')).toHaveTextContent('uc_2');
    expect(screen.getByTestId('profile-source')).toHaveTextContent('storage');
    expect(screen.getByTestId('profile-is-offline')).toHaveTextContent('true');
  });

  it('creates a local development fallback profile when auth is available but the backend is offline and there is no cache', async () => {
    mockUseAuth.mockReturnValue({
      auth: {
        authId: 'dev-auth',
        userClientId: 'dev-user',
        clientId: defaultTestClient._id,
        email: 'dev.user@havenova.local',
        role: 'user',
        isLogged: true,
        isVerified: true,
        isNewUser: false,
      },
      refreshAuth: jest.fn(),
      setAuth: jest.fn(),
      source: 'dev-fallback',
      isOffline: true,
      lastSyncAt: null,
    });

    mockedGetUserClientProfile.mockRejectedValue(new Error('Network failed'));

    renderWithAppProviders(
      <ProfileProvider>
        <ProfileConsumer />
      </ProfileProvider>,
      {
        withClient: true,
        clientOptions: { initialClient: defaultTestClient },
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId('profile-source')).toHaveTextContent('dev-fallback');
    });
    expect(screen.getByTestId('profile-user-client-id')).toHaveTextContent('dev-user');
    expect(screen.getByTestId('profile-contact-email')).toHaveTextContent('dev.user@havenova.local');
    expect(screen.getByTestId('profile-is-offline')).toHaveTextContent('true');
  });
});
