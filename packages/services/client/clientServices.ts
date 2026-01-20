// services/clientServices.ts

import { ClientPublicConfig } from '../../types/client/clientTypes';
import api from '../api/api';

export async function getClient(domain: string): Promise<ClientPublicConfig> {
  try {
    const { data } = await api.get(`/api/clients/public/${domain}`);
    return data.data as ClientPublicConfig;
  } catch {
    return {
      _id: '',
      companyName: '',
      domain,
      contactEmail: '',
      phone: '',
      address: '',
      legalUpdates: {},
      schedule: {
        monday: { start: '00:00', end: '00:00' },
        tuesday: { start: '00:00', end: '00:00' },
        wednesday: { start: '00:00', end: '00:00' },
        thursday: { start: '00:00', end: '00:00' },
        friday: { start: '00:00', end: '00:00' },
      },
    };
  }
}
