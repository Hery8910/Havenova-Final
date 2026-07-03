import { ApiResponse } from '../types/api/apiTypes';
import {
  AdminRecord,
  CreateAdminProfilePayload,
  ResendAdminInvitePayload,
  ResendAdminInviteResponse,
  UpdateAdminProfilePayload,
} from '../types/admin/adminTypes';
import sameOriginApi from './api/sameOriginApi';

const ADMIN_PROFILE_BASE_PATH = '/api/home-services/admin';

export const createAdminProfile = async (
  payload: CreateAdminProfilePayload
): Promise<AdminRecord> => {
  const { data } = await sameOriginApi.post<ApiResponse<AdminRecord>>(ADMIN_PROFILE_BASE_PATH, payload, {
    withCredentials: true,
  });
  return data.data;
};

export const getAdminProfile = async (): Promise<AdminRecord> => {
  const { data } = await sameOriginApi.get<ApiResponse<AdminRecord>>(ADMIN_PROFILE_BASE_PATH, {
    withCredentials: true,
  });
  return data.data;
};

export const updateAdminProfile = async (
  payload: UpdateAdminProfilePayload
): Promise<AdminRecord> => {
  const { data } = await sameOriginApi.patch<ApiResponse<AdminRecord>>(
    ADMIN_PROFILE_BASE_PATH,
    payload,
    { withCredentials: true }
  );
  return data.data;
};

export const deleteAdminProfile = async (): Promise<{ userClientId: string; clientId: string }> => {
  const { data } = await sameOriginApi.delete<
    ApiResponse<{ userClientId: string; clientId: string }>
  >(ADMIN_PROFILE_BASE_PATH, { withCredentials: true });
  return data.data;
};

export const resendAdminInvite = async (
  payload: ResendAdminInvitePayload
): Promise<ResendAdminInviteResponse> => {
  const { data } = await sameOriginApi.post<ResendAdminInviteResponse>(
    `${ADMIN_PROFILE_BASE_PATH}/resend-invite`,
    payload,
    {
      withCredentials: true,
    }
  );
  return data;
};
