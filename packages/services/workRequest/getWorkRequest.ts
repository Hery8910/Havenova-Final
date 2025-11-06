// packages/services/workRequestService.ts
import api from '../api/api';

// 🔹 Filtros opcionales (status, fecha, búsqueda)
export interface RequestFilters {
  status?: string;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// 🔹 Estructura actual simplificada de cada WorkRequest en la tabla
export interface WorkRequestSummary {
  _id: string;
  status: string;
  createdAt: string;
  user: string | null; // solo nombre del cliente
  services: string[]; // tipos de servicios (e.g. ['kitchen-cleaning', 'inspection'])
}

// 🔹 Respuesta completa del backend
export interface WorkRequestsResponse {
  success: boolean;
  count: number;
  workRequests: WorkRequestSummary[];
  pagination?: {
    page: number;
    limit: number;
  };
}

// 🔹 Llamada al backend
export async function getWorkRequests(
  clientId: string,
  filters: RequestFilters = {}
): Promise<WorkRequestsResponse> {
  const params = new URLSearchParams();

  params.append('clientId', clientId);

  if (filters.status) params.append('status', filters.status);
  if (filters.date) params.append('date', filters.date);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', String(filters.page));
  if (filters.limit) params.append('limit', String(filters.limit));

  const { data } = await api.get<WorkRequestsResponse>(`/api/workRequests?${params.toString()}`);

  return data;
}
