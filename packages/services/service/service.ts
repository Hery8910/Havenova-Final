import api from '../api/api';

export interface ServiceItem {
  _id: string;
  serviceType: string;
  status: string;
  price: number;
  estimatedDuration: number;
  icon?: string;
  details?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Crear servicio
export async function createService(payload: Partial<ServiceItem>) {
  const { data } = await api.post<{ success: boolean; service: ServiceItem }>(
    '/api/services',
    payload
  );
  return data.service;
}

// Obtener todos
export async function getServices(clientId?: string, userId?: string) {
  const params = new URLSearchParams();
  if (clientId) params.append('clientId', clientId);
  if (userId) params.append('userId', userId);

  const { data } = await api.get<{ success: boolean; services: ServiceItem[] }>(
    `/api/services?${params.toString()}`
  );
  return data.services;
}

// Obtener por ID
export async function getServiceById(id: string) {
  const { data } = await api.get<{ success: boolean; service: ServiceItem }>(`/api/services/${id}`);
  return data.service;
}

// Actualizar servicio
export async function updateService(id: string, payload: Partial<ServiceItem>) {
  const { data } = await api.patch<{ success: boolean; service: ServiceItem }>(
    `/api/services/${id}`,
    payload
  );
  return data.service;
}
