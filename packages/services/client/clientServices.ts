// services/clientServices.ts

import { ClientPublicConfig } from '../../types/client/clientTypes';
import api from '../api/api';

export async function getClient(domain: string): Promise<ClientPublicConfig> {
  const { data } = await api.get(`/api/clients/public/${domain}`);

  return data.data as ClientPublicConfig;
}
