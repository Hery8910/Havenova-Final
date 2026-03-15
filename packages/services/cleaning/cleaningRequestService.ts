import api from '../api/api';
import type { ApiResponse } from '@/packages/types/api';
import type { CleaningRequestSubmission } from '@/packages/types/services/servicesTypes';

export interface CleaningRequestCreatePayload extends CleaningRequestSubmission {
  clientId: string;
  userId?: string;
}

export interface CleaningRequestCreateResponse {
  success: boolean;
  code: string;
  message?: string;
  data: {
    id?: string;
  };
}

export const createCleaningRequest = async (
  payload: CleaningRequestCreatePayload
): Promise<CleaningRequestCreateResponse> => {
  const { data } = await api.post<ApiResponse<{ id?: string }>>(
    '/api/home-services/service-request',
    payload,
    {
      withCredentials: true,
    }
  );

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: {
      id: data.data?.id,
    },
  };
};
