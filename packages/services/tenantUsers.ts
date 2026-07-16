import axios from 'axios';

import sameOriginApi from './api/sameOriginApi';
import type {
  InviteTenantUserPayload,
  InviteTenantUserResponse,
  ResendTenantUserInvitationPayload,
  ResendTenantUserInvitationResponse,
  RevokeTenantUserInvitationResponse,
  TenantUserDirectoryDetail,
  TenantUserDirectoryDetailResponse,
  TenantUserInvitationMutationResponse,
  TenantUserInvitationRevokeMutationResponse,
  TenantUserDirectoryErrorCode,
  TenantUsersDirectoryFilter,
  TenantUsersDirectoryPage,
  TenantUsersDirectoryPageResponse,
  TenantUsersDirectorySummary,
  TenantUsersDirectorySummaryResponse,
} from '../types';

const TENANT_USERS_BASE_PATH = '/api/home-services/dashboard/users';

export type TenantUsersDirectoryQuery = {
  q?: string;
  status?: TenantUsersDirectoryFilter;
  cursor?: string;
  limit?: number;
  signal?: AbortSignal;
};

const buildTenantUsersDirectoryQuery = (query: TenantUsersDirectoryQuery = {}) => {
  const searchParams = new URLSearchParams();

  if (query.q?.trim()) {
    searchParams.set('q', query.q.trim());
  }

  if (query.status && query.status !== 'all') {
    searchParams.set('status', query.status);
  }

  if (query.cursor) {
    searchParams.set('cursor', query.cursor);
  }

  if (query.limit) {
    searchParams.set('limit', String(query.limit));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : '';
};

const tenantUserDirectoryErrorCodes = new Set<TenantUserDirectoryErrorCode>([
  'TENANT_USER_ALREADY_EXISTS',
  'TENANT_USER_INVITATION_ALREADY_PENDING',
  'TENANT_USER_INVITATION_DELIVERY_FAILED',
  'TENANT_USER_INVITATION_NOT_FOUND',
  'TENANT_USER_INVITATION_ACCEPTED',
  'TENANT_USER_INVITATION_REVOKED',
]);

export const getTenantUserDirectoryErrorCode = (
  error: unknown
): TenantUserDirectoryErrorCode | undefined => {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const code = error.response?.data?.code;
  return typeof code === 'string' && tenantUserDirectoryErrorCodes.has(code as TenantUserDirectoryErrorCode)
    ? (code as TenantUserDirectoryErrorCode)
    : undefined;
};

export const getTenantUsersDirectorySummary =
  async (): Promise<TenantUsersDirectorySummary> => {
    const { data } = await sameOriginApi.get<TenantUsersDirectorySummaryResponse>(
      `${TENANT_USERS_BASE_PATH}/summary`,
      { withCredentials: true }
    );

    return data.data;
  };

export const getTenantUsersDirectoryPage = async (
  query: TenantUsersDirectoryQuery = {}
): Promise<TenantUsersDirectoryPage> => {
  const { signal, ...queryParams } = query;
  const { data } = await sameOriginApi.get<TenantUsersDirectoryPageResponse>(
    `${TENANT_USERS_BASE_PATH}/directory${buildTenantUsersDirectoryQuery(queryParams)}`,
    { signal, withCredentials: true }
  );

  return data.data;
};

export const getTenantUserDirectoryDetail = async (
  entryId: string,
  signal?: AbortSignal
): Promise<TenantUserDirectoryDetail> => {
  const safeEntryId = encodeURIComponent(entryId.trim());
  const { data } = await sameOriginApi.get<TenantUserDirectoryDetailResponse>(
    `${TENANT_USERS_BASE_PATH}/entries/${safeEntryId}`,
    { signal, withCredentials: true }
  );

  return data.data;
};

export const inviteTenantUser = async (
  payload: InviteTenantUserPayload
): Promise<TenantUserInvitationMutationResponse> => {
  const { data } = await sameOriginApi.post<InviteTenantUserResponse>(
    `${TENANT_USERS_BASE_PATH}/invite`,
    payload,
    { withCredentials: true }
  );

  return { code: data.code, data: data.data };
};

export const resendTenantUserInvitation = async (
  invitationId: string,
  payload: ResendTenantUserInvitationPayload = {}
): Promise<TenantUserInvitationMutationResponse> => {
  const safeInvitationId = encodeURIComponent(invitationId.trim());
  const { data } = await sameOriginApi.post<ResendTenantUserInvitationResponse>(
    `${TENANT_USERS_BASE_PATH}/invitations/${safeInvitationId}/resend`,
    payload,
    { withCredentials: true }
  );

  return { code: data.code, data: data.data };
};

export const revokeTenantUserInvitation = async (
  invitationId: string
): Promise<TenantUserInvitationRevokeMutationResponse> => {
  const safeInvitationId = encodeURIComponent(invitationId.trim());
  const { data } = await sameOriginApi.post<RevokeTenantUserInvitationResponse>(
    `${TENANT_USERS_BASE_PATH}/invitations/${safeInvitationId}/revoke`,
    {},
    { withCredentials: true }
  );

  return { code: data.code, data: data.data };
};
