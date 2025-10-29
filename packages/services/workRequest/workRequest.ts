// packages/services/workRequestService.ts
import api from '../api/api';

export interface RequestFilters {
  status?: string;
  date?: string;
  search?: string;
}

export interface WorkRequestSummary {
  _id: string;
  status: string;
  serviceAddress: string;
  preferredDate: string;
  preferredTime: string;
  totalPrice: number;
  totalEstimatedDuration: number;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  services: {
    _id: string;
    type: string;
    status: string;
    price: number;
    estimatedDuration: number;
  }[];
}

export interface WorkRequestsResponse {
  success: boolean;
  count: number;
  workRequests: WorkRequestSummary[];
}

export async function getWorkRequests(clientId: string, filters: RequestFilters = {}) {
  const params = new URLSearchParams({ clientId, ...filters });
  const { data } = await api.get<WorkRequestsResponse>(`/api/workRequests?${params.toString()}`);
  return data;
}
