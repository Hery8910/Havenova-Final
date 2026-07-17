import type { TenantUserDirectoryDetail } from '@/packages/types';

const relationshipSummary = {
  requests: { active: 0, total: 0 },
  workOrders: null,
  nextAppointmentAt: null,
  lastCompletedServiceAt: null,
};

const userDetail = (overrides: Partial<TenantUserDirectoryDetail>): TenantUserDirectoryDetail => ({
  entryId: 'user:ada',
  kind: 'user',
  identity: {
    displayName: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    phone: '+49 30 123456',
    profileImage: null,
  },
  access: null,
  profile: {
    exists: true,
    language: 'en',
    primaryAddress: {
      street: 'A very long street name for representative layout validation',
      streetNumber: '184B',
      postalCode: '10115',
      district: 'Berlin-Mitte',
      floor: 'Fourth floor',
    },
  },
  invitation: null,
  relationshipSummary,
  businessActivityAt: '2026-07-17T08:00:00.000Z',
  createdAt: '2026-07-17T08:00:00.000Z',
  availableActions: { resendInvitation: false, revokeInvitation: false },
  ...overrides,
});

export const tenantUserDirectoryFixtures = {
  userWithCompleteProfile: userDetail({}),
  userWithPartialProfile: userDetail({
    entryId: 'user:partial',
    profile: { exists: true, language: 'es', primaryAddress: null },
  }),
  userWithoutProfile: userDetail({
    entryId: 'user:no-profile',
    identity: { displayName: 'No Profile', email: 'no.profile@example.com', phone: null, profileImage: null },
    profile: { exists: false, language: null, primaryAddress: null },
  }),
  pendingInvitation: {
    ...userDetail({
      entryId: 'invitation:pending',
      kind: 'invitation',
      identity: { displayName: 'Proposed Customer', email: 'proposed@example.com', phone: '+34 600 111 222', profileImage: null },
      profile: null,
      invitation: {
        invitationId: 'invitation-pending',
        status: 'pending',
        expiresAt: '2026-08-01T08:00:00.000Z',
        lastSentAt: '2026-07-17T08:00:00.000Z',
        sendCount: 1,
        attentionReasons: [],
      },
      availableActions: { resendInvitation: true, revokeInvitation: true },
    }),
  },
  expiredInvitation: {
    ...userDetail({
      entryId: 'invitation:expired',
      kind: 'invitation',
      identity: { displayName: null, email: 'expired@example.com', phone: null, profileImage: null },
      profile: null,
      invitation: {
        invitationId: 'invitation-expired',
        status: 'expired',
        expiresAt: '2026-07-01T08:00:00.000Z',
        lastSentAt: '2026-06-01T08:00:00.000Z',
        sendCount: 2,
        attentionReasons: [],
      },
      availableActions: { resendInvitation: true, revokeInvitation: true },
    }),
  },
} satisfies Record<string, TenantUserDirectoryDetail>;
