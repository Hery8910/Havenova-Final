import { ApiResponse } from '../api';

export type ContactMessageStatus = 'pending' | 'answered';

export interface ContactMessageCreatePayload {
  clientId: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  profileImage?: string;
  userId?: string;
}

export interface ContactMessageCreateResult {
  id: string;
}

export type ContactMessageCreateResponse = ApiResponse<ContactMessageCreateResult>;

export interface ContactMessageResponseData {
  text: string;
  respondedBy?: string;
  respondedByName?: string;
  respondedByProfileImage?: string;
  respondedAt?: string;
}

export interface ContactMessage {
  _id: string;
  clientId: string;
  userId?: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  profileImage?: string;
  response?: ContactMessageResponseData;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagesQuery {
  clientId?: string;
  status?: ContactMessageStatus;
  email?: string;
  name?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ContactMessagesListResponse {
  success: boolean;
  code?: string;
  message?: string;
  count: number;
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
  };
  totals?: {
    total: number;
    pending: number;
    answered: number;
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

export interface ContactMessageDeleteResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface ContactMessageFormData extends Record<string, any> {
  name: string;
  email: string;
  subject: string;
  message: string;
  clientId: string;
  userId: string;
  profileImage?: string;
  language?: string;
}
