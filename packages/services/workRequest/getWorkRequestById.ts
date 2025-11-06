import api from '../api/api';

export interface WorkRequestDetailData {
  _id: string;
  user: {
    name: string;
    email: string;
    phone: string;
  } | null;
  status: string;
  serviceAddress: string;
  totalPrice: number;
  totalEstimatedDuration: number;
  totalActualDuration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  services: {
    _id: string;
    serviceType: string;
    status: string;
    price: number;
    estimatedDuration: number;
    schedule: {
      start?: string;
      end?: string;
      bufferBefore?: number;
      bufferAfter?: number;
    };
    assignedWorkers?: {
      _id: string;
      name: string;
      email: string;
      phone: string;
    }[];
    details: Record<string, any>;
    icon?: string;
  }[];
}

export async function getWorkRequestById(id: string) {
  const { data } = await api.get<{ success: boolean; workRequest: WorkRequestDetailData }>(
    `/api/workRequests/${id}`
  );
  return data.workRequest;
}
