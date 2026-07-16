import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USER_INVITATION_ACCEPT_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/user-invitations/accept',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUserInvitationAcceptRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USER_INVITATION_ACCEPT_ROUTE_CONFIG);

export const POST = handleTenantUserInvitationAcceptRoute;
