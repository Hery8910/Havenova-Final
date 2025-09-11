// services/clientServices.ts
import api from './api';
import { ClientConfig } from '../types/client';

export async function getClient(domain: string): Promise<ClientConfig> {
  const { data } = await api.get(`/api/clients/by-domain/${domain}`);
  return data as ClientConfig;
}
