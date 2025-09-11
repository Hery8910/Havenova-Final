import { ApiResponse } from '../types/api';
import { CreateWorkerPayload } from '../types/worker';
import api from './api';

export const createWorker = async (
  payload: CreateWorkerPayload
): Promise<ApiResponse<{ workerId: string }>> => {
  const response = await api.post<ApiResponse<{ workerId: string }>>(
    '/api/workers/create',
    payload
  );
  return response.data;
};
