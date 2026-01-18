import { ApiResponse } from '../types/api/apiTypes';
import {
  CreateWorkerPayload,
  CreateWorkerProfilePayload,
  UpdateWorkerProfilePayload,
  WorkerListItem,
  WorkerListMeta,
  WorkerListParams,
  WorkerRecord,
} from '../types/worker/workerTypes';
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

const WORKER_PROFILE_BASE_PATH = '/api/home-services/worker';

export const createWorkerProfile = async (
  payload: CreateWorkerProfilePayload
): Promise<WorkerRecord> => {
  const { data } = await api.post<ApiResponse<WorkerRecord>>(WORKER_PROFILE_BASE_PATH, payload, {
    withCredentials: true,
  });
  return data.data;
};

export const getWorkerProfile = async (): Promise<WorkerRecord> => {
  const { data } = await api.get<ApiResponse<WorkerRecord>>(WORKER_PROFILE_BASE_PATH, {
    withCredentials: true,
  });
  return data.data;
};

export const updateWorkerProfile = async (
  payload: UpdateWorkerProfilePayload
): Promise<WorkerRecord> => {
  const { data } = await api.patch<ApiResponse<WorkerRecord>>(
    WORKER_PROFILE_BASE_PATH,
    payload,
    { withCredentials: true }
  );
  return data.data;
};

export const deleteWorkerProfile = async (): Promise<{ userId: string; clientId: string }> => {
  const { data } = await api.delete<ApiResponse<{ userId: string; clientId: string }>>(
    WORKER_PROFILE_BASE_PATH,
    { withCredentials: true }
  );
  return data.data;
};

export const listWorkers = async (
  params: WorkerListParams = {}
): Promise<{ workers: WorkerListItem[]; meta: WorkerListMeta }> => {
  const { data } = await api.get<ApiResponse<WorkerListItem[]>>(
    `${WORKER_PROFILE_BASE_PATH}/list`,
    { params, withCredentials: true }
  );
  return { workers: data.data ?? [], meta: data.meta };
};
