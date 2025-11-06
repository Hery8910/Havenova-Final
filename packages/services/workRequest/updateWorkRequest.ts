import api from '../api/api';

// 🔹 Datos que se pueden actualizar desde el dashboard
export interface UpdateWorkRequestPayload {
  notes?: string;
  status?: string;
  totalPrice?: number;
  totalEstimatedDuration?: number;
}

// 🔹 Respuesta del backend al actualizar
export interface UpdateWorkRequestResponse {
  success: boolean;
  code: string;
  message: string;
  workRequest: {
    _id: string;
    status: string;
    notes?: string;
    totalPrice: number;
    totalEstimatedDuration: number;
    updatedAt: string;
  };
}

// 🔹 Llamada PATCH al backend
export async function updateWorkRequest(
  id: string,
  payload: UpdateWorkRequestPayload
): Promise<UpdateWorkRequestResponse> {
  const { data } = await api.patch<UpdateWorkRequestResponse>(`/api/workRequests/${id}`, payload);
  return data;
}
