import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  PropertyManager,
  PropertyManagerCreatePayload,
  PropertyManagerCreateResponse,
  PropertyManagerDetailResponse,
  PropertyManagersListResponse,
  PropertyManagersMeta,
  PropertyManagersQuery,
  PropertyManagerUpdatePayload,
  PropertyManagerUpdateResponse,
} from '@/packages/types/propertyManager';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const listPropertyManagers = async (
  params: PropertyManagersQuery,
  accessToken?: string
): Promise<PropertyManagersListResponse> => {
  const { data } = await api.get<{
    success: boolean;
    code: string;
    message?: string;
    data: PropertyManager[];
    meta: PropertyManagersMeta;
  }>('/api/home-services/property-managers', {
    params,
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });
  return data as PropertyManagersListResponse;
};

export const createPropertyManager = async (
  payload: PropertyManagerCreatePayload,
  accessToken?: string
): Promise<PropertyManagerCreateResponse> => {
  const { data } = await api.post<ApiResponse<{ id: string }>>(
    '/api/home-services/property-managers',
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const updatePropertyManager = async (
  id: string,
  payload: PropertyManagerUpdatePayload,
  accessToken?: string
): Promise<PropertyManagerUpdateResponse> => {
  const { data } = await api.patch<ApiResponse<{ id: string }>>(
    `/api/home-services/property-managers/${id}`,
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const getPropertyManagerById = async (
  id: string,
  accessToken?: string
): Promise<PropertyManagerDetailResponse> => {
  const { data } = await api.get<PropertyManagerDetailResponse>(
    `/api/home-services/property-managers/${id}`,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};
