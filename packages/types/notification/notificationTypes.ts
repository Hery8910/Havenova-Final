import type { ApiResponse } from '../api';

export type NotificationCategory = 'profile' | 'service-request' | 'job' | 'billing' | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high';

export type NotificationActorKind = 'user' | 'worker' | 'admin' | 'system';

export type NotificationEntityType = 'service-request' | 'job' | 'invoice' | 'profile';

export type NotificationType =
  | 'SERVICE_REQUEST_CREATED'
  | 'SERVICE_REQUEST_DATE_CONFIRMED'
  | 'SERVICE_REQUEST_DATE_PROPOSED'
  | 'SERVICE_REQUEST_CANCELLED'
  | 'JOB_ASSIGNED'
  | 'JOB_COMPLETED'
  | 'INVOICE_CREATED'
  | 'INVOICE_PAID'
  | 'INVOICE_OVERDUE'
  | 'PROFILE_INCOMPLETE'
  | 'SYSTEM_MAINTENANCE'
  | 'CONTACT_MESSAGE_USER'
  | 'CONTACT_MESSAGE_ADMIN';

export interface NotificationActor {
  kind: NotificationActorKind;
  label?: string;
  role?: string;
  userClientId?: string;
}

export interface NotificationEntity {
  entityType: NotificationEntityType;
  entityId: string;
  label?: string;
}

export interface NotificationAction {
  label: string;
  url?: string;
}

export type NotificationMetadata = Record<string, unknown>;

export interface NotificationItem {
  id: string;
  recipientUserClientId: string;
  clientId: string;
  category: NotificationCategory;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  actor?: NotificationActor;
  entity?: NotificationEntity;
  metadata?: NotificationMetadata;
  action?: NotificationAction;
  readAt?: string | null;
  seenAt?: string | null;
  archivedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationBellItem {
  id: string;
  category: NotificationCategory;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  action?: NotificationAction;
  readAt?: string | null;
  seenAt?: string | null;
  createdAt: string;
}

export interface NotificationUnreadSummary {
  total: number;
  highPriorityTotal: number;
  hasHighPriorityUnread: boolean;
}

export interface NotificationListQuery {
  category?: NotificationCategory;
  type?: NotificationType;
  unreadOnly?: boolean;
  importantOnly?: boolean;
  entityType?: NotificationEntityType;
  entityId?: string;
  page?: number;
  limit?: number;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface NotificationBellResponse {
  success: boolean;
  code?: string;
  message?: string;
  items: NotificationBellItem[];
  summary: NotificationUnreadSummary;
}

export interface NotificationListResponse {
  success: boolean;
  code?: string;
  message?: string;
  notifications: NotificationItem[];
  count: number;
  pagination: NotificationPagination;
  summary?: NotificationUnreadSummary;
}

export interface NotificationUnreadCountResponse {
  success: boolean;
  code?: string;
  message?: string;
  data: NotificationUnreadSummary;
}

export interface NotificationMutationResponse {
  success: boolean;
  code: string;
  message?: string;
}

export interface NotificationBellSeenPayload {
  notificationIds: string[];
}

export type NotificationBellApiResponse = ApiResponse<{
  items?: NotificationBellItem[];
  notifications?: NotificationBellItem[];
  summary?: NotificationUnreadSummary;
  total?: number;
  highPriorityTotal?: number;
  hasHighPriorityUnread?: boolean;
}>;

export type NotificationListApiResponse = ApiResponse<{
  items?: NotificationItem[];
  notifications?: NotificationItem[];
  count?: number;
  pagination?: Partial<NotificationPagination>;
  summary?: NotificationUnreadSummary;
}>;

export type NotificationUnreadSummaryApiResponse =
  | ApiResponse<NotificationUnreadSummary>
  | ApiResponse<{
      summary?: NotificationUnreadSummary;
      total?: number;
      highPriorityTotal?: number;
      hasHighPriorityUnread?: boolean;
    }>;
