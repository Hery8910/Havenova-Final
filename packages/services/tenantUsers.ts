import sameOriginApi from './api/sameOriginApi';
import type {
  InviteTenantUserPayload,
  InviteTenantUserResponse,
  ResendTenantUserInvitePayload,
  ResendTenantUserInviteResponse,
  TenantUserDetail,
  TenantUserDetailResponse,
  TenantUsersListQuery,
  TenantUsersListResponse,
} from '../types';

const TENANT_USERS_BASE_PATH = '/api/home-services/dashboard/users';

const buildTenantUsersQuery = (query: TenantUsersListQuery = {}) => {
  const searchParams = new URLSearchParams();

  if (query.page) {
    searchParams.set('page', String(query.page));
  }

  if (query.limit) {
    searchParams.set('limit', String(query.limit));
  }

  if (query.search?.trim()) {
    searchParams.set('search', query.search.trim());
  }

  if (query.status) {
    searchParams.set('status', query.status);
  }

  if (typeof query.hasProfile === 'boolean') {
    searchParams.set('hasProfile', String(query.hasProfile));
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : '';
};

export const getTenantUsers = async (
  query: TenantUsersListQuery = {}
): Promise<{ data: TenantUsersListResponse['data']; meta: TenantUsersListResponse['meta'] }> => {
  const { data } = await sameOriginApi.get<TenantUsersListResponse>(
    `${TENANT_USERS_BASE_PATH}${buildTenantUsersQuery(query)}`,
    { withCredentials: true }
  );

  return {
    data: data.data,
    meta: data.meta,
  };
};

export const getTenantUserDetail = async (userClientId: string): Promise<TenantUserDetail> => {
  const safeUserClientId = encodeURIComponent(userClientId.trim());
  const { data } = await sameOriginApi.get<TenantUserDetailResponse>(
    `${TENANT_USERS_BASE_PATH}/${safeUserClientId}`,
    { withCredentials: true }
  );
  return data.data;
};

export const inviteTenantUser = async (
  payload: InviteTenantUserPayload
): Promise<InviteTenantUserResponse['data']> => {
  const { data } = await sameOriginApi.post<InviteTenantUserResponse>(
    `${TENANT_USERS_BASE_PATH}/invite`,
    payload,
    { withCredentials: true }
  );
  return data.data;
};

export const resendTenantUserInvite = async (
  payload: ResendTenantUserInvitePayload
): Promise<ResendTenantUserInviteResponse['data']> => {
  const { data } = await sameOriginApi.post<ResendTenantUserInviteResponse>(
    `${TENANT_USERS_BASE_PATH}/resend-invite`,
    payload,
    { withCredentials: true }
  );
  return data.data;
};
