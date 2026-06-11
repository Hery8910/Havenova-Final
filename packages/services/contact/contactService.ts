import api from '../api/api';
import { ApiResponse } from '@/packages/types/api';
import {
  ContactMessage,
  ContactMessageBulkDeleteResponse,
  ContactMessageCreatePayload,
  ContactMessageCreateResponse,
  ContactMessagesListResponse,
  ContactMessagesQuery,
  ContactMessagesTotals,
  ContactMessagesPagination,
  ContactMessageRespondPayload,
  ContactMessageRespondResponse,
  ContactMessageDeleteResponse,
} from '@/packages/types/contact';

const buildAuthHeaders = (accessToken?: string) =>
  accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;

const DEFAULT_CONTACT_PAGINATION: ContactMessagesPagination = {
  page: 1,
  limit: 10,
};

const DEFAULT_CONTACT_TOTALS: ContactMessagesTotals = {
  total: 0,
  pending: 0,
  answered: 0,
};

const normalizeContactMessage = (message: any): ContactMessage => ({
  _id: message?._id ?? message?.id ?? '',
  clientId: message?.clientId ?? '',
  source: {
    channel: message?.source?.channel ?? 'public_form',
    userClientId: message?.source?.userClientId ?? null,
  },
  sender: {
    name: message?.sender?.name ?? '',
    email: message?.sender?.email ?? '',
    profileImage: message?.sender?.profileImage ?? '',
  },
  content: {
    subject: message?.content?.subject ?? '',
    body: message?.content?.body ?? '',
  },
  response: message?.response
    ? {
        text: message.response.text ?? '',
        respondedByUserClientId: message.response.respondedByUserClientId ?? null,
        respondedByName: message.response.respondedByName ?? '',
        respondedByProfileImage: message.response.respondedByProfileImage ?? '',
        respondedAt: message.response.respondedAt ?? '',
      }
    : undefined,
  configurationSnapshot: message?.configurationSnapshot
    ? {
        serviceConfigKey: message.configurationSnapshot.serviceConfigKey ?? '',
        serviceConfigVersion: message.configurationSnapshot.serviceConfigVersion ?? 0,
        intakeVersion: message.configurationSnapshot.intakeVersion ?? 0,
      }
    : undefined,
  status: message?.status ?? 'pending',
  anonymizedAt: message?.anonymizedAt ?? null,
  createdAt: message?.createdAt ?? '',
  updatedAt: message?.updatedAt ?? '',
});

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
  const { data } = await api.get<ApiResponse<any[]>>('/api/contact', {
    params,
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: Array.isArray(data.data) ? data.data.map(normalizeContactMessage) : [],
    meta: {
      count: data.meta?.count ?? 0,
      pagination: data.meta?.pagination ?? DEFAULT_CONTACT_PAGINATION,
      totals: data.meta?.totals ?? DEFAULT_CONTACT_TOTALS,
    },
  };
};

export const respondContactMessage = async (
  id: string,
  payload: ContactMessageRespondPayload,
  accessToken?: string
): Promise<ContactMessageRespondResponse> => {
  const { data } = await api.patch<ApiResponse<any>>(
    `/api/contact/${id}/respond`,
    payload,
    {
      withCredentials: true,
      headers: buildAuthHeaders(accessToken),
    }
  );

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: data.data ? normalizeContactMessage(data.data) : undefined,
  };
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

export const deleteContactMessages = async (
  accessToken?: string
): Promise<ContactMessageBulkDeleteResponse> => {
  const { data } = await api.delete<ContactMessageBulkDeleteResponse>('/api/contact', {
    withCredentials: true,
    headers: buildAuthHeaders(accessToken),
  });

  return data;
};
