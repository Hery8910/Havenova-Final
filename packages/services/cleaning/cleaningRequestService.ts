import api from '../api/api';
import type { ApiResponse } from '@/packages/types';
import type {
  CleaningServiceRequest,
  CreateServiceRequestInput,
} from '@/packages/types';

export type CleaningRequestCreatePayload = CreateServiceRequestInput<'cleaning'>;

export interface CleaningRequestCreateResponse {
  success: boolean;
  code: string;
  message?: string;
  data: CleaningServiceRequest | null;
}

export const createCleaningRequest = async (
  payload: CleaningRequestCreatePayload
): Promise<CleaningRequestCreateResponse> => {
  const { data } = await api.post<ApiResponse<CleaningServiceRequest>>(
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
    data: data.data ?? null,
  };
};
