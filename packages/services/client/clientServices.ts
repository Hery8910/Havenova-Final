import type {
  ClientBootstrapConfig,
  ClientBootstrapResponse,
  ClientDashboardResponse,
  ClientDashboardView,
} from '../../types/client/clientTypes';
import api from '../api/api';
import { resolveTenantKey } from './tenantResolver';

export const DEFAULT_CLIENT_TENANT_KEY = resolveTenantKey();

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

const toClientResponseError = (message: string, responseData: unknown, status = 500) => {
  const error: Error & { response?: { status: number; data: unknown } } = new Error(message);
  error.response = {
    status,
    data: responseData,
  };
  return error;
};

export async function getClient(
  tenantKey: string = DEFAULT_CLIENT_TENANT_KEY
): Promise<ClientBootstrapConfig> {
  const normalizedTenantKey = tenantKey.trim();
  if (normalizedTenantKey.length < 8) {
    throw new Error('Invalid tenantKey: minimum length is 8 characters.');
  }

  const safeTenantKey = encodeURIComponent(normalizedTenantKey);
  const { data } = await api.get<ClientBootstrapResponse>(`/api/clients/tenant/${safeTenantKey}`, {
    timeout: 8000,
  });

  if (!data?.success || !data?.data) {
    throw toClientResponseError(data?.message || 'Client bootstrap fetch failed', data);
  }

  return data.data;
}

export async function getClientDashboard(
  clientId: string,
  accessToken?: string
): Promise<ClientDashboardView> {
  const normalizedClientId = clientId.trim();
  if (!normalizedClientId) {
    throw new Error('Invalid clientId: value is required.');
  }

  const safeClientId = encodeURIComponent(normalizedClientId);
  const { data } = await api.get<ClientDashboardResponse>(
    `/api/clients/dashboard/${safeClientId}`,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  if (!data?.success || !data?.data) {
    throw toClientResponseError(data?.message || 'Client dashboard fetch failed', data);
  }

  return data.data;
}
