import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  UserClientProfile,
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
  CreateUserProfileResponse,
} from '@/packages/types/profile/profileTypes';

// ---------------------------
// GET PROFILE
// ---------------------------

export const getUserClientProfile = async (): Promise<UserClientProfile> => {
  const { data } = await api.get<ApiResponse<UserClientProfile>>('/api/home-services/profile', {
    withCredentials: true,
  });

  if (!data.success || !data.data) {
    const status = data.code === 'USER_CLIENT_PROFILE_NOT_FOUND' ? 404 : 500;
    const error: any = new Error(data.message || 'Profile fetch failed');
    error.response = { status, data };
    throw error;
  }

  return data.data;
};

// ---------------------------
// UPSERT PROFILE
// ---------------------------

export const updateUserClientProfile = async (
  payload: UpdateUserProfilePayload
): Promise<UpdateUserProfileResponse> => {
  const { data } = await api.patch<ApiResponse<UserClientProfile>>(
    '/api/home-services/profile',
    payload,
    { withCredentials: true }
  );

  return {
    success: data.success,
    code: data.code,
    profile: data.data,
  };
};

// ---------------------------
// CREATE PROFILE (new users)
// ---------------------------

export const createUserClientProfile = async (
  payload: UpdateUserProfilePayload
): Promise<CreateUserProfileResponse> => {
  const { data } = await api.post<ApiResponse<UserClientProfile>>(
    '/api/home-services/profile',
    payload,
    { withCredentials: true }
  );

  return {
    success: data.success,
    code: data.code,
    profile: data.data,
  };
};
