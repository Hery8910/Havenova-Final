import api from '../api/api';
import {
  AreaKey,
  CatalogBundleDetail,
  GlobalTaskCatalogSummary,
  GlobalTaskCatalogApiResponse,
  RecurrenceKey,
} from '@/packages/types';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const getGlobalTaskCatalog = async (
  params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'inactive';
    title?: string;
    recurrenceKey?: RecurrenceKey;
    areaKey?: AreaKey;
  },
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.get<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    '/api/task-catalog',
    {
      params,
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const getGlobalTaskCatalogBundle = async (
  bundleId: string,
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<CatalogBundleDetail>> => {
  const { data } = await api.get<GlobalTaskCatalogApiResponse<CatalogBundleDetail>>(
    `/api/task-catalog/bundles/${bundleId}`,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const createGlobalTaskCatalog = async (
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.post<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    '/api/task-catalog',
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const updateGlobalTaskCatalog = async (
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.patch<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    '/api/task-catalog',
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const updateGlobalTaskCatalogBundles = async (
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.patch<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    '/api/task-catalog/bundles',
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const updateGlobalTaskCatalogBundleSteps = async (
  bundleId: string,
  payload: Record<string, unknown>,
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.patch<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    `/api/task-catalog/bundles/${bundleId}/steps`,
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const seedGlobalTaskCatalog = async (
  accessToken?: string
): Promise<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.post<GlobalTaskCatalogApiResponse<GlobalTaskCatalogSummary>>(
    '/api/task-catalog/seed',
    {},
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};
