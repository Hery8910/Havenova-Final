import api from '../api/api';
import { ApiResponse, CatalogBundleDetail, GlobalTaskCatalogSummary } from '@/packages/types';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const getGlobalTaskCatalog = async (
  accessToken?: string
): Promise<ApiResponse<GlobalTaskCatalogSummary>> => {
  const { data } = await api.get<ApiResponse<GlobalTaskCatalogSummary>>(
    '/api/home-services/global-task-catalog',
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const getGlobalTaskCatalogBundle = async (
  bundleId: string,
  accessToken?: string
): Promise<ApiResponse<CatalogBundleDetail>> => {
  const { data } = await api.get<ApiResponse<CatalogBundleDetail>>(
    `/api/home-services/global-task-catalog/bundles/${bundleId}`,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};
