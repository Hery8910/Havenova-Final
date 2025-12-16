import { ApiResponse } from '../api';

export interface ContactMessageCreatePayload {
  userId: string;
  clientId: string;
  name: string;
  email: string;
  message: string;
}

export interface ContactMessageCreateResult {
  id: string;
}

export type ContactMessageCreateResponse = ApiResponse<ContactMessageCreateResult>;

export interface ContactMessageResponseData {
  text: string;
  respondedBy: string;
  respondedAt: string;
}

export interface ContactMessage {
  _id: string;
  clientId: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  response?: ContactMessageResponseData;
  status: 'pending' | 'answered';
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagesQuery {
  clientId?: string;
  page?: number;
  limit?: number;
}

export interface ContactMessagesListResponse {
  success: boolean;
  count: number;
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
  };
}

export interface ContactMessageRespondPayload {
  text: string;
}

export interface ContactMessageRespondResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface ContactMessageFormData extends Record<string, any> {
  name: string;
  email: string;
  message: string;
  clientId: string;
  userId: string;
  language?: string;
}
