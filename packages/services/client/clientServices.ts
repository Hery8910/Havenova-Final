import { ClientPublicConfig } from '../../types/client/clientTypes';
import api from '../api/api';

export const DEFAULT_CLIENT_TENANT_KEY =
  process.env.NEXT_PUBLIC_TENANT_KEY ?? 'tnk_demo_havenova';

export async function getClient(tenantKey: string = DEFAULT_CLIENT_TENANT_KEY): Promise<ClientPublicConfig> {
  const normalizedTenantKey = tenantKey.trim();
  if (normalizedTenantKey.length < 8) {
    throw new Error('Invalid tenantKey: minimum length is 8 characters.');
  }

  const safeTenantKey = encodeURIComponent(normalizedTenantKey);
  const { data } = await api.get(`/api/client/tenant/${safeTenantKey}`);
  return data.data as ClientPublicConfig;
}
