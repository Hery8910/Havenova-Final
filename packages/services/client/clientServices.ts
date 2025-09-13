// services/clientServices.ts

import { ClientConfig } from '../../types/client/clientTypes';
import api from '../api/api';

export async function getClient(domain: string): Promise<ClientConfig> {
  const { data } = await api.get(`/api/clients/by-domain/${domain}`);
  return data as ClientConfig;
}
