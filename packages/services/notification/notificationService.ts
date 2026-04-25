import api from '../api/api';
import type {
  NotificationBellApiResponse,
  NotificationBellItem,
  NotificationBellResponse,
  NotificationBellSeenPayload,
  NotificationItem,
  NotificationListApiResponse,
  NotificationListQuery,
  NotificationListResponse,
  NotificationMutationResponse,
  NotificationPagination,
  NotificationUnreadCountResponse,
  NotificationUnreadSummary,
  NotificationUnreadSummaryApiResponse,
} from '@/packages/types/notification';

const NOTIFICATIONS_PATH = '/api/notifications';

type NotificationRecord = Partial<NotificationItem> & {
  id?: string;
  _id?: string;
};

type NotificationBellRecord = Partial<NotificationBellItem> & {
  id?: string;
  _id?: string;
};

const getNotificationId = ({ id, _id }: { id?: string; _id?: string }) => id ?? _id ?? '';

const normalizeUnreadSummary = (
  input?:
    | Partial<NotificationUnreadSummary>
    | {
        summary?: NotificationUnreadSummary;
        total?: number;
        highPriorityTotal?: number;
        hasHighPriorityUnread?: boolean;
      }
): NotificationUnreadSummary => {
  const summary =
    input && typeof input === 'object' && 'summary' in input ? input.summary : undefined;
  const source = summary ?? input;

  const total = Number(source?.total ?? 0);
  const highPriorityTotal = Number(source?.highPriorityTotal ?? 0);
  const hasHighPriorityUnread =
    typeof source?.hasHighPriorityUnread === 'boolean'
      ? source.hasHighPriorityUnread
      : highPriorityTotal > 0;

  return {
    total,
    highPriorityTotal,
    hasHighPriorityUnread,
  };
};

const normalizeNotificationBellItem = (item: NotificationBellRecord): NotificationBellItem => ({
  id: getNotificationId(item),
  category: item.category ?? 'system',
  type: item.type ?? 'SYSTEM_MAINTENANCE',
  priority: item.priority ?? 'normal',
  title: item.title ?? '',
  body: item.body ?? '',
  action: item.action,
  readAt: item.readAt ?? null,
  seenAt: item.seenAt ?? null,
  createdAt: item.createdAt ?? '',
});

const normalizeNotificationItem = (item: NotificationRecord): NotificationItem => ({
  id: getNotificationId(item),
  recipientUserClientId: item.recipientUserClientId ?? '',
  clientId: item.clientId ?? '',
  category: item.category ?? 'system',
  type: item.type ?? 'SYSTEM_MAINTENANCE',
  priority: item.priority ?? 'normal',
  title: item.title ?? '',
  body: item.body ?? '',
  actor: item.actor,
  entity: item.entity,
  metadata: item.metadata ?? {},
  action: item.action,
  readAt: item.readAt ?? null,
  seenAt: item.seenAt ?? null,
  archivedAt: item.archivedAt ?? null,
  expiresAt: item.expiresAt ?? null,
  createdAt: item.createdAt ?? '',
  updatedAt: item.updatedAt ?? item.createdAt ?? '',
});

const normalizePagination = (
  pagination: Partial<NotificationPagination> | undefined,
  fallback: { page?: number; limit?: number; count: number }
): NotificationPagination => ({
  page: Number(pagination?.page ?? fallback.page ?? 1),
  limit: Number(pagination?.limit ?? fallback.limit ?? fallback.count ?? 0),
  total:
    typeof pagination?.total === 'number' ? pagination.total : fallback.count,
  totalPages:
    typeof pagination?.totalPages === 'number' ? pagination.totalPages : undefined,
  hasNextPage:
    typeof pagination?.hasNextPage === 'boolean' ? pagination.hasNextPage : undefined,
  hasPreviousPage:
    typeof pagination?.hasPreviousPage === 'boolean' ? pagination.hasPreviousPage : undefined,
});

const normalizeBellPayload = (data: NotificationBellApiResponse): NotificationBellResponse => {
  const items = (data.data?.items ?? data.data?.notifications ?? []).map(normalizeNotificationBellItem);
  const summary =
    data.data?.summary ??
    normalizeUnreadSummary({
      total: data.data?.total,
      highPriorityTotal: data.data?.highPriorityTotal,
      hasHighPriorityUnread: data.data?.hasHighPriorityUnread,
    });

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    items,
    summary: normalizeUnreadSummary(summary),
  };
};

const normalizeListPayload = (
  data: NotificationListApiResponse,
  query: NotificationListQuery
): NotificationListResponse => {
  const notifications = (data.data?.items ?? data.data?.notifications ?? []).map(
    normalizeNotificationItem
  );
  const count = Number(data.data?.count ?? notifications.length);

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    notifications,
    count,
    pagination: normalizePagination(data.data?.pagination, {
      page: query.page,
      limit: query.limit,
      count,
    }),
    summary: data.data?.summary ? normalizeUnreadSummary(data.data.summary) : undefined,
  };
};

const normalizeMutationResponse = (
  data: NotificationMutationResponse
): NotificationMutationResponse => ({
  success: data.success,
  code: data.code,
  message: data.message,
});

const buildNotificationListParams = (query: NotificationListQuery) =>
  Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined));

const normalizeBellSeenPayload = (
  payload: NotificationBellSeenPayload
): NotificationBellSeenPayload => ({
  notificationIds: [...new Set(payload.notificationIds.filter(Boolean))].slice(0, 5),
});

export const getNotificationBell = async (): Promise<NotificationBellResponse> => {
  const { data } = await api.get<NotificationBellApiResponse>(`${NOTIFICATIONS_PATH}/bell`, {
    withCredentials: true,
  });

  return normalizeBellPayload(data);
};

export const listNotifications = async (
  query: NotificationListQuery = {}
): Promise<NotificationListResponse> => {
  const { data } = await api.get<NotificationListApiResponse>(NOTIFICATIONS_PATH, {
    params: buildNotificationListParams(query),
    withCredentials: true,
  });

  return normalizeListPayload(data, query);
};

export const getUnreadNotificationCount = async (): Promise<NotificationUnreadCountResponse> => {
  const { data } = await api.get<NotificationUnreadSummaryApiResponse>(
    `${NOTIFICATIONS_PATH}/count/unread`,
    {
      withCredentials: true,
    }
  );

  return {
    success: data.success,
    code: data.code,
    message: data.message,
    data: normalizeUnreadSummary(data.data),
  };
};

export const markNotificationsBellSeen = async (
  payload: NotificationBellSeenPayload
): Promise<NotificationMutationResponse> => {
  const { data } = await api.post<NotificationMutationResponse>(
    `${NOTIFICATIONS_PATH}/bell/seen`,
    normalizeBellSeenPayload(payload),
    {
      withCredentials: true,
    }
  );

  return normalizeMutationResponse(data);
};

export const markNotificationSeen = async (
  notificationId: string
): Promise<NotificationMutationResponse> => {
  const { data } = await api.post<NotificationMutationResponse>(
    `${NOTIFICATIONS_PATH}/${notificationId}/seen`,
    {},
    {
      withCredentials: true,
    }
  );

  return normalizeMutationResponse(data);
};

export const markNotificationRead = async (
  notificationId: string
): Promise<NotificationMutationResponse> => {
  const { data } = await api.post<NotificationMutationResponse>(
    `${NOTIFICATIONS_PATH}/${notificationId}/read`,
    {},
    {
      withCredentials: true,
    }
  );

  return normalizeMutationResponse(data);
};

export const markAllNotificationsRead = async (): Promise<NotificationMutationResponse> => {
  const { data } = await api.post<NotificationMutationResponse>(
    `${NOTIFICATIONS_PATH}/read-all`,
    {},
    {
      withCredentials: true,
    }
  );

  return normalizeMutationResponse(data);
};
