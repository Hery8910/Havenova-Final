import api from '../api/api';
import type { ApiResponse } from '@/packages/types/api';
import type {
  CreateUserClientProfileInput,
  DeleteUserClientProfileResponse,
  UpdateUserClientProfileInput,
  UserClientProfile,
  UserClientProfileMutationResponse,
} from '@/packages/types/profile/profileTypes';

const USER_CLIENT_PROFILE_PATH = '/api/home-services/profile';

const normalizeProfile = (profile: UserClientProfile): UserClientProfile => ({
  ...profile,
  savedAddresses: profile.savedAddresses ?? [],
  extra: profile.extra ?? {},
});

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
  const { data } = await api.patch<ApiResponse<UserClientProfile>>(USER_CLIENT_PROFILE_PATH, payload, {
    withCredentials: true,
  });

  return {
    success: data.success,
    code: data.code,
    profile: normalizeProfile(data.data),
  };
};

export const createUserClientProfile = async (
  payload: CreateUserClientProfileInput
): Promise<UserClientProfileMutationResponse> => {
  const { data } = await api.post<ApiResponse<UserClientProfile>>(USER_CLIENT_PROFILE_PATH, payload, {
    withCredentials: true,
  });

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
