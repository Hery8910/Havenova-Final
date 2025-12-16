import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  ContactMessageCreatePayload,
  ContactMessageCreateResponse,
  ContactMessagesListResponse,
  ContactMessagesQuery,
  ContactMessageRespondPayload,
  ContactMessageRespondResponse,
} from '@/packages/types/contact';

export const sendContactMessage = async (
  payload: ContactMessageCreatePayload
): Promise<ContactMessageCreateResponse> => {
  const { data } = await api.post<ApiResponse<{ id: string }>>('/api/contact', payload);
  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: { id: data.data?.id },
  };
};

export const getContactMessages = async (
  params: ContactMessagesQuery
): Promise<ContactMessagesListResponse> => {
  const { data } = await api.get<ContactMessagesListResponse>('/api/contact', {
    params,
    withCredentials: true,
  });
  return data;
};

export const respondContactMessage = async (
  id: string,
  payload: ContactMessageRespondPayload
): Promise<ContactMessageRespondResponse> => {
  const { data } = await api.patch<ApiResponse<null>>(
    `/api/contact/${id}/respond`,
    payload,
    { withCredentials: true }
  );

  return {
    success: data.success,
    code: data.code,
    message: data.message,
  };
};
