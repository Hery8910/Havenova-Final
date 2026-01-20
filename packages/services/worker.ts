import { ApiResponse } from '../types/api/apiTypes';
import {
  CreateWorkerProfilePayload,
  UpdateWorkerProfilePayload,
  WorkerListItem,
  WorkerListMeta,
  WorkerListParams,
  WorkerRecord,
  WorkerDetailData,
} from '../types/worker/workerTypes';
import api from './api/api';

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

type WorkerDetailResponse = ApiResponse<WorkerDetailData> & { worker?: WorkerDetailData };

export const getWorkerById = async (workerId: string): Promise<WorkerDetailData> => {
  const { data } = await api.get<WorkerDetailResponse>(
    `${WORKER_PROFILE_BASE_PATH}/${workerId}`,
    { withCredentials: true }
  );
  return data.worker ?? data.data;
};
