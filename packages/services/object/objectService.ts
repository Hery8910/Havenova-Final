import api from '../api/api';
import {
  BuildingCreatePayload,
  BuildingCreateResponse,
  BuildingDetail,
  BuildingDetailResponse,
  BuildingListItem,
  BuildingListMeta,
  BuildingListQuery,
  BuildingListResponse,
  BuildingUpdatePayload,
  BuildingUpdateResponse,
} from '@/packages/types/object';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const listBuildings = async (
  params: BuildingListQuery,
  accessToken?: string
): Promise<BuildingListResponse> => {
  const { data } = await api.get<{
    success: boolean;
    code: string;
    message?: string;
    data: BuildingListItem[];
    meta: BuildingListMeta;
  }>('/api/home-services/building', {
    params,
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });
  return data as BuildingListResponse;
};

export const createBuilding = async (
  payload: BuildingCreatePayload,
  accessToken?: string
): Promise<BuildingCreateResponse> => {
  const { data } = await api.post<BuildingCreateResponse>('/api/home-services/building', payload, {
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });

  return data;
};

export const updateBuilding = async (
  id: string,
  payload: BuildingUpdatePayload,
  accessToken?: string
): Promise<BuildingUpdateResponse> => {
  const { data } = await api.patch<BuildingUpdateResponse>(
    `/api/home-services/building/${id}`,
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const getBuildingById = async (
  id: string,
  accessToken?: string
): Promise<BuildingDetailResponse> => {
  const { data } = await api.get<BuildingDetailResponse>(
    `/api/home-services/building/${id}`,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};
