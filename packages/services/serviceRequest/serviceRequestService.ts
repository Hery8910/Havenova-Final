import api from '../api/api';
import type { ApiResponse } from '@/packages/types';
import type {
  CreateServiceRequestInput,
  ServiceRequest,
  ServiceType,
} from '@/packages/types';

export type CreateServiceRequestPayload<TServiceType extends ServiceType = ServiceType> =
  CreateServiceRequestInput<TServiceType>;

export interface CreateServiceRequestResponse<TServiceType extends ServiceType = ServiceType> {
  success: boolean;
  code: string;
  message?: string;
  data: ServiceRequest<TServiceType> | null;
}

export const createServiceRequest = async <TServiceType extends ServiceType>(
  payload: CreateServiceRequestPayload<TServiceType>
): Promise<CreateServiceRequestResponse<TServiceType>> => {
  const { data } = await api.post<ApiResponse<ServiceRequest<TServiceType>>>(
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
