import type { ApiResponse } from './api';
import type { AppLanguage, ThemeMode } from './profile';

export type TenantUserStatus = 'active' | 'invited' | 'blocked';
export type TenantUserProfileCompleteness = 'missing' | 'partial' | 'complete';

export interface TenantUserListItem {
  userClientId: string;
  authId: string;
  clientId: string;
  email: string;
  name?: string;
  phone?: string;
  userClientStatus: TenantUserStatus;
  isVerified: boolean;
  hasProfile: boolean;
  profileCompleteness?: TenantUserProfileCompleteness;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUsersListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface TenantUsersListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: TenantUserStatus;
  hasProfile?: boolean;
}

export interface TenantUsersListResponse extends ApiResponse<TenantUserListItem[]> {
  code: 'TENANT_USERS_LIST';
  meta: TenantUsersListMeta;
}

export interface TenantUserProfileSummary {
  id: string;
  contactEmail?: string;
  name?: string;
  phone?: string;
  profileImage?: string;
  language?: AppLanguage;
  theme?: ThemeMode;
  notificationPreferences?: Record<string, unknown>;
  extra?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUserDetail {
  userClientId: string;
  authId: string;
  clientId: string;
  email: string;
  authStatus: TenantUserStatus;
  isVerified: boolean;
  role: 'user';
  userClientStatus: TenantUserStatus;
  invitedBy?: string;
  invitedAt?: string;
  hasProfile: boolean;
  profileCompleteness: TenantUserProfileCompleteness;
  profile: TenantUserProfileSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUserDetailResponse extends ApiResponse<TenantUserDetail> {
  code: 'TENANT_USER_FOUND';
}

export interface InviteTenantUserPayload {
  clientId: string;
  email: string;
  name: string;
  language: AppLanguage;
  phone?: string;
}

export interface InviteTenantUserResult {
  authId: string;
  userClientId: string;
  clientId: string;
  email: string;
  name?: string;
  language?: AppLanguage;
  authCreated?: boolean;
  userClientCreated?: boolean;
  inviteSent?: boolean;
}

export interface InviteTenantUserResponse extends ApiResponse<InviteTenantUserResult> {
  code: 'TENANT_USER_INVITED';
}

export interface ResendTenantUserInvitePayload {
  clientId: string;
  email: string;
  language?: AppLanguage;
}

export interface ResendTenantUserInviteResult {
  userClientId: string;
  clientId: string;
  email: string;
  name?: string;
  language?: AppLanguage;
}

export interface ResendTenantUserInviteResponse
  extends ApiResponse<ResendTenantUserInviteResult> {
  code: 'TENANT_USER_INVITE_RESENT';
}
