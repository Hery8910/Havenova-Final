import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  UserClientProfile,
  WorkerProfile,
  UpdateUserProfilePayload,
  UpdateUserProfileResponse,
  ContactMessagePayload,
  ContactMessageResponse,
} from '@/packages/types/profile/profileTypes';

// ---------------------------
// GET PROFILE
// ---------------------------

export const getUserClientProfile = async (clientId: string): Promise<UserClientProfile> => {
  const { data } = await api.get<ApiResponse<UserClientProfile>>('/api/home-services/profile/me', {
    params: { clientId },
    withCredentials: true,
  });
  return data.data;
};

// ---------------------------
// UPSERT PROFILE
// ---------------------------

export const createOrUpdateUserClientProfile = async (
  payload: UpdateUserProfilePayload
): Promise<UpdateUserProfileResponse> => {
  const { data } = await api.patch<ApiResponse<UserClientProfile>>(
    '/api/home-services/profile/me',
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
// WORKER PROFILE (si existe en backend)
// ---------------------------

export const getWorkerProfile = async (clientId: string): Promise<WorkerProfile> => {
  const { data } = await api.get<ApiResponse<WorkerProfile>>(
    '/api/home-services/worker/profile/me',
    { params: { clientId }, withCredentials: true }
  );
  return data.data;
};

// ---------------------------
// CONTACT MESSAGE
// ---------------------------

export const sendContactMessage = async (
  payload: ContactMessagePayload
): Promise<ContactMessageResponse> => {
  const { data } = await api.post<ApiResponse<null>>('/api/contact', payload);

  return {
    success: data.success,
    code: data.code,
    message: data.message,
  };
};
