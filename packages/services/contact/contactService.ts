import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  ContactMessageCreatePayload,
  ContactMessageCreateResponse,
  ContactMessagesListResponse,
  ContactMessagesQuery,
  ContactMessageRespondPayload,
  ContactMessageRespondResponse,
  ContactMessageDeleteResponse,
} from '@/packages/types/contact';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

export const createContactMessage = async (
  payload: ContactMessageCreatePayload
): Promise<ContactMessageCreateResponse> => {
  const { data } = await api.post<ApiResponse<{ id: string }>>('/api/contact', payload, {
    withCredentials: true,
  });

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: { id: data.data?.id },
  };
};

export const listContactMessages = async (
  params: ContactMessagesQuery,
  accessToken?: string
): Promise<ContactMessagesListResponse> => {
  const { data } = await api.get<ContactMessagesListResponse>('/api/contact', {
    params,
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });
  return data;
};

export const respondContactMessage = async (
  id: string,
  payload: ContactMessageRespondPayload,
  accessToken?: string
): Promise<ContactMessageRespondResponse> => {
  const { data } = await api.patch<ContactMessageRespondResponse>(
    `/api/contact/${id}/respond`,
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return data;
};

export const deleteContactMessage = async (
  id: string,
  accessToken?: string
): Promise<ContactMessageDeleteResponse> => {
  const { data } = await api.delete<ContactMessageDeleteResponse>(`/api/contact/${id}`, {
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });

  return data;
};

// Backwards compatibility aliases
export const sendContactMessage = createContactMessage;
export const getContactMessages = listContactMessages;
