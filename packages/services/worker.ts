import { ApiResponse } from '../types/api/apiTypes';
import {
  CreateWorkerProfilePayload,
  ResendWorkerInvitePayload,
  ResendWorkerInviteResponse,
  UpdateWorkerProfilePayload,
  WorkerListItem,
  WorkerListMeta,
  WorkerListParams,
  WorkerRecord,
  WorkerDetailData,
} from '../types/worker/workerTypes';
import sameOriginApi from './api/sameOriginApi';

const WORKER_PROFILE_BASE_PATH = '/api/home-services/worker';

export const createWorkerProfile = async (
  payload: CreateWorkerProfilePayload
): Promise<WorkerRecord> => {
  const { data } = await sameOriginApi.post<ApiResponse<WorkerRecord>>(
    WORKER_PROFILE_BASE_PATH,
    payload,
    {
      withCredentials: true,
    }
  );
  return data.data;
};

export const getWorkerProfile = async (): Promise<WorkerRecord> => {
  const { data } = await sameOriginApi.get<ApiResponse<WorkerRecord>>(WORKER_PROFILE_BASE_PATH, {
    withCredentials: true,
  });
  return data.data;
};

export const updateWorkerProfile = async (
  payload: UpdateWorkerProfilePayload
): Promise<WorkerRecord> => {
  const { data } = await sameOriginApi.patch<ApiResponse<WorkerRecord>>(
    WORKER_PROFILE_BASE_PATH,
    payload,
    { withCredentials: true }
  );
  return data.data;
};

export const deleteWorkerProfile = async (): Promise<{ userClientId: string; clientId: string }> => {
  const { data } = await sameOriginApi.delete<
    ApiResponse<{ userClientId: string; clientId: string }>
  >(WORKER_PROFILE_BASE_PATH, { withCredentials: true });
  return data.data;
};

export const listWorkers = async (
  params: WorkerListParams = {}
): Promise<{ workers: WorkerListItem[]; meta: WorkerListMeta }> => {
  const { data } = await sameOriginApi.get<ApiResponse<WorkerListItem[]>>(
    `${WORKER_PROFILE_BASE_PATH}/list`,
    { params, withCredentials: true }
  );
  return { workers: data.data ?? [], meta: data.meta };
};

type WorkerDetailResponse = ApiResponse<WorkerDetailData> & { worker?: WorkerDetailData };

export const getWorkerById = async (workerId: string): Promise<WorkerDetailData> => {
  const { data } = await sameOriginApi.get<WorkerDetailResponse>(
    `${WORKER_PROFILE_BASE_PATH}/${workerId}`,
    { withCredentials: true }
  );
  return data.worker ?? data.data;
};

export const resendWorkerInvite = async (
  payload: ResendWorkerInvitePayload
): Promise<ResendWorkerInviteResponse> => {
  const { data } = await sameOriginApi.post<ResendWorkerInviteResponse>(
    `${WORKER_PROFILE_BASE_PATH}/resend-invite`,
    payload,
    {
      withCredentials: true,
    }
  );
  return data;
};
