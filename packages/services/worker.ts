import { ApiResponse } from '../types/api/apiTypes';
import { CreateWorkerPayload } from '../types/worker/workerTypes';
import api from './api/api';

export const createWorker = async (
  payload: CreateWorkerPayload
): Promise<ApiResponse<{ workerId: string }>> => {
  const response = await api.post<ApiResponse<{ workerId: string }>>(
    '/api/workers/create',
    payload
  );
  return response.data;
};
