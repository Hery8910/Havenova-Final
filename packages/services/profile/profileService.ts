import api from '../api/api';
import type { ApiResponse } from '@/packages/types/api';
import type {
  CreateUserClientProfileInput,
  DeleteUserClientProfileResponse,
  UserNotificationPreferences,
  UpdateUserClientProfileInput,
  UserClientProfile,
  UserClientProfileMutationResponse,
} from '@/packages/types/profile/profileTypes';

const USER_CLIENT_PROFILE_PATH = '/api/home-services/profile';

const defaultNotificationPreferences = (): UserNotificationPreferences => ({
  inApp: {
    enabled: true,
    required: true,
  },
  email: {
    important: {
      enabled: true,
      required: true,
    },
    reminders: {
      enabled: false,
    },
    promotional: {
      enabled: false,
    },
  },
});

const normalizeProfile = (profile: UserClientProfile): UserClientProfile => ({
  ...profile,
  contactEmail: profile.contactEmail ?? '',
  savedAddresses: profile.savedAddresses ?? [],
  notificationPreferences: {
    ...defaultNotificationPreferences(),
    ...profile.notificationPreferences,
    inApp: {
      ...defaultNotificationPreferences().inApp,
      ...profile.notificationPreferences?.inApp,
    },
    email: {
      ...defaultNotificationPreferences().email,
      ...profile.notificationPreferences?.email,
      important: {
        ...defaultNotificationPreferences().email.important,
        ...profile.notificationPreferences?.email?.important,
      },
      reminders: {
        ...defaultNotificationPreferences().email.reminders,
        ...profile.notificationPreferences?.email?.reminders,
      },
      promotional: {
        ...defaultNotificationPreferences().email.promotional,
        ...profile.notificationPreferences?.email?.promotional,
      },
    },
  },
  extra: profile.extra ?? {},
});

const hasOwnKeys = (value: Record<string, unknown> | undefined): value is Record<string, unknown> =>
  !!value && Object.keys(value).length > 0;

const sanitizeAddress = (address: UserClientProfile['primaryAddress']) => {
  if (!address) return undefined;

  const sanitized = {
    street: address.street?.trim(),
    streetNumber: address.streetNumber?.trim(),
    postalCode: address.postalCode?.trim(),
    district: address.district?.trim(),
    floor: address.floor?.trim() || undefined,
  };

  if (!sanitized.street || !sanitized.streetNumber || !sanitized.postalCode || !sanitized.district) {
    return undefined;
  }

  return sanitized;
};

const sanitizeSavedAddresses = (savedAddresses: UserClientProfile['savedAddresses'] | undefined) => {
  if (savedAddresses === undefined) return undefined;

  const sanitized = (savedAddresses ?? [])
    .map((entry) => {
      const address = sanitizeAddress(entry?.address);
      if (!address) return null;

      return {
        label: entry.label?.trim() || undefined,
        address,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return sanitized;
};

const sanitizeNotificationPreferences = (
  notificationPreferences:
    | CreateUserClientProfileInput['notificationPreferences']
    | UpdateUserClientProfileInput['notificationPreferences']
) => {
  if (!notificationPreferences?.email) return undefined;

  const remindersEnabled = notificationPreferences.email.reminders?.enabled;
  const promotionalEnabled = notificationPreferences.email.promotional?.enabled;

  const email = Object.fromEntries(
    Object.entries({
      reminders:
        typeof remindersEnabled === 'boolean' ? { enabled: remindersEnabled } : undefined,
      promotional:
        typeof promotionalEnabled === 'boolean' ? { enabled: promotionalEnabled } : undefined,
    }).filter(([, value]) => value !== undefined)
  );

  return Object.keys(email).length > 0 ? { email } : undefined;
};

const sanitizeProfilePayload = <
  T extends CreateUserClientProfileInput | UpdateUserClientProfileInput,
>(
  payload: T
): T => {
  const sanitized = {
    ...payload,
    name: payload.name?.trim() || undefined,
    phone: payload.phone?.trim() || undefined,
    primaryAddress: sanitizeAddress(payload.primaryAddress),
    savedAddresses: sanitizeSavedAddresses(payload.savedAddresses),
    profileImage: payload.profileImage?.trim() || undefined,
    notificationPreferences: sanitizeNotificationPreferences(payload.notificationPreferences),
    extra: hasOwnKeys(payload.extra) ? payload.extra : undefined,
  };

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => value !== undefined)
  ) as T;
};

export const getUserClientProfile = async (): Promise<UserClientProfile> => {
  const { data } = await api.get<ApiResponse<UserClientProfile>>(USER_CLIENT_PROFILE_PATH, {
    withCredentials: true,
  });

  if (!data.success || !data.data) {
    const status = data.code === 'USER_CLIENT_PROFILE_NOT_FOUND' ? 404 : 500;
    const error: Error & { response?: { status: number; data: unknown } } = new Error(
      data.message || 'Profile fetch failed'
    );
    error.response = { status, data };
    throw error;
  }

  return normalizeProfile(data.data);
};

export const updateUserClientProfile = async (
  payload: UpdateUserClientProfileInput
): Promise<UserClientProfileMutationResponse> => {
  const { data } = await api.patch<ApiResponse<UserClientProfile>>(
    USER_CLIENT_PROFILE_PATH,
    sanitizeProfilePayload(payload),
    {
      withCredentials: true,
    }
  );

  return {
    success: data.success,
    code: data.code,
    profile: normalizeProfile(data.data),
  };
};

export const createUserClientProfile = async (
  payload: CreateUserClientProfileInput
): Promise<UserClientProfileMutationResponse> => {
  const { data } = await api.post<ApiResponse<UserClientProfile>>(
    USER_CLIENT_PROFILE_PATH,
    sanitizeProfilePayload(payload),
    {
      withCredentials: true,
    }
  );

  return {
    success: data.success,
    code: data.code,
    profile: normalizeProfile(data.data),
  };
};

export const deleteUserClientProfile = async (): Promise<DeleteUserClientProfileResponse> => {
  const { data } = await api.delete<ApiResponse<{ userId: string; clientId: string }>>(
    USER_CLIENT_PROFILE_PATH,
    {
      withCredentials: true,
      data: {},
    }
  );

  return {
    success: data.success,
    code: data.code,
    data: data.data,
  };
};
