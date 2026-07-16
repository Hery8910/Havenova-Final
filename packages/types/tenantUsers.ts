import type { ApiResponse } from './api';
import type { AppLanguage } from './profile';

export type TenantUsersDirectoryFilter =
  | 'all'
  | 'active'
  | 'inactive'
  | 'invitations'
  | 'attention';

export type TenantUserAttentionReason =
  | 'INVITATION_EXPIRED'
  | 'EMAIL_UNVERIFIED_STALE'
  | 'ACCOUNT_LOCKED';

export type TenantUserDirectoryEntryKind = 'user' | 'invitation';
export type TenantUserAccountStatus = 'active' | 'inactive' | 'locked';
export type TenantUserVerificationStatus = 'verified' | 'unverified';
export type TenantUserInvitationStatus = 'pending' | 'expired';

export interface TenantUsersDirectorySummary {
  totalUsers: number;
  pendingInvites: number;
  needsAttention: number;
}

export interface TenantUserRelationshipSummary {
  requests: {
    total: number;
    active: number;
  };
  workOrders: {
    total: number;
    active: number;
  } | null;
  nextAppointmentAt: string | null;
  lastCompletedServiceAt: string | null;
}

export interface TenantUserDirectoryEntry {
  entryId: string;
  kind: TenantUserDirectoryEntryKind;
  userClientId: string;
  invitationId: string | null;
  displayName: string | null;
  email: string;
  phone: string | null;
  accountStatus: TenantUserAccountStatus | null;
  verificationStatus: TenantUserVerificationStatus | null;
  invitationStatus: TenantUserInvitationStatus | null;
  invitationExpiresAt: string | null;
  attentionReasons: TenantUserAttentionReason[];
  relationshipSummary: TenantUserRelationshipSummary;
  businessActivityAt: string;
}

export interface TenantUsersDirectoryPage {
  items: TenantUserDirectoryEntry[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface TenantUserDirectoryAddress {
  street: string;
  streetNumber: string;
  postalCode: string;
  district: string;
  floor?: string;
}

export interface TenantUserDirectoryDetail {
  entryId: string;
  kind: TenantUserDirectoryEntryKind;
  identity: {
    displayName: string | null;
    email: string;
    phone: string | null;
    profileImage: string | null;
  };
  access: {
    accountStatus: TenantUserAccountStatus;
    verificationStatus: TenantUserVerificationStatus;
    attentionReasons: TenantUserAttentionReason[];
  } | null;
  profile: {
    exists: boolean;
    language: AppLanguage | null;
    primaryAddress: TenantUserDirectoryAddress | null;
  } | null;
  invitation: {
    invitationId: string;
    status: TenantUserInvitationStatus;
    expiresAt: string;
    lastSentAt: string;
    sendCount: number;
    attentionReasons: TenantUserAttentionReason[];
  } | null;
  relationshipSummary: TenantUserRelationshipSummary;
  businessActivityAt: string;
  createdAt: string;
  availableActions: {
    resendInvitation: boolean;
    revokeInvitation: boolean;
  };
}

export interface TenantUserInvitationMutationResult {
  entryId: string;
  invitationId: string;
  email: string;
  displayName: string;
  status: 'pending';
  expiresAt: string;
  lastSentAt: string;
}

export interface TenantUserInvitationRevokeResult {
  invitationId: string;
  revokedAt: string;
}

export type TenantUserInvitationMutationCode =
  | 'TENANT_USER_INVITED'
  | 'TENANT_USER_INVITATION_RENEWED'
  | 'TENANT_USER_INVITATION_RESENT';

export type TenantUserDirectoryErrorCode =
  | 'TENANT_USER_ALREADY_EXISTS'
  | 'TENANT_USER_INVITATION_ALREADY_PENDING'
  | 'TENANT_USER_INVITATION_DELIVERY_FAILED'
  | 'TENANT_USER_INVITATION_NOT_FOUND'
  | 'TENANT_USER_INVITATION_ACCEPTED'
  | 'TENANT_USER_INVITATION_REVOKED';

export interface TenantUserInvitationMutationResponse {
  code: TenantUserInvitationMutationCode;
  data: TenantUserInvitationMutationResult;
}

export interface TenantUserInvitationRevokeMutationResponse {
  code: 'TENANT_USER_INVITATION_REVOKED';
  data: TenantUserInvitationRevokeResult;
}

export interface TenantUsersDirectorySummaryResponse
  extends ApiResponse<TenantUsersDirectorySummary> {
  code: 'TENANT_USERS_DIRECTORY_SUMMARY';
}

export interface TenantUsersDirectoryPageResponse extends ApiResponse<TenantUsersDirectoryPage> {
  code: 'TENANT_USERS_DIRECTORY_LIST';
}

export interface TenantUserDirectoryDetailResponse
  extends ApiResponse<TenantUserDirectoryDetail> {
  code: 'TENANT_USER_DIRECTORY_ENTRY_FOUND';
}

export interface InviteTenantUserPayload {
  email: string;
  name: string;
  phone?: string;
  language: AppLanguage;
}

export interface InviteTenantUserResponse
  extends ApiResponse<TenantUserInvitationMutationResult> {
  code: 'TENANT_USER_INVITED' | 'TENANT_USER_INVITATION_RENEWED';
}

export interface ResendTenantUserInvitationPayload {
  language?: AppLanguage;
}

export interface ResendTenantUserInvitationResponse
  extends ApiResponse<TenantUserInvitationMutationResult> {
  code: 'TENANT_USER_INVITATION_RESENT';
}

export interface RevokeTenantUserInvitationResponse
  extends ApiResponse<TenantUserInvitationRevokeResult> {
  code: 'TENANT_USER_INVITATION_REVOKED';
}
