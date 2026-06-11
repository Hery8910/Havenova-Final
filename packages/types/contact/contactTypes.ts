import { ApiResponse } from '../api';

export type ContactMessageStatus = 'pending' | 'answered';
export type ContactMessageLanguage = 'de' | 'en' | 'es';
export type ContactMessageSourceChannel = 'public_form';

export interface ContactMessageCreatePayload {
  clientId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  profileImage?: string;
  language?: ContactMessageLanguage;
}

export interface ContactMessageCreateResult {
  id: string;
}

export type ContactMessageCreateResponse = ApiResponse<ContactMessageCreateResult>;

export interface ContactMessageSource {
  channel: ContactMessageSourceChannel;
  userClientId?: string | null;
}

export interface ContactMessageSender {
  name: string;
  email: string;
  profileImage?: string;
}

export interface ContactMessageContent {
  subject: string;
  body: string;
}

export interface ContactMessageResponseData {
  text: string;
  respondedByUserClientId?: string | null;
  respondedByName?: string;
  respondedByProfileImage?: string;
  respondedAt?: string;
}

export interface ContactMessageConfigurationSnapshot {
  serviceConfigKey: string;
  serviceConfigVersion: number;
  intakeVersion: number;
}

export interface ContactMessage {
  _id: string;
  clientId: string;
  source: ContactMessageSource;
  sender: ContactMessageSender;
  content: ContactMessageContent;
  response?: ContactMessageResponseData;
  configurationSnapshot?: ContactMessageConfigurationSnapshot;
  status: ContactMessageStatus;
  anonymizedAt?: string | null;
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

export interface ContactMessagesPagination {
  page: number;
  limit: number;
}

export interface ContactMessagesTotals {
  total: number;
  pending: number;
  answered: number;
}

export interface ContactMessagesListMeta {
  count: number;
  pagination: ContactMessagesPagination;
  totals: ContactMessagesTotals;
}

export interface ContactMessagesListResponse {
  success: boolean;
  code?: string;
  message?: string;
  data: ContactMessage[];
  meta: ContactMessagesListMeta;
}

export interface ContactMessageRespondPayload {
  text: string;
}

export interface ContactMessageRespondResponse {
  success: boolean;
  code: string;
  message?: string;
  data?: ContactMessage;
}

export interface ContactMessageDeleteResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface ContactMessageBulkDeleteResult {
  deletedCount: number;
}

export type ContactMessageBulkDeleteResponse = ApiResponse<ContactMessageBulkDeleteResult>;
