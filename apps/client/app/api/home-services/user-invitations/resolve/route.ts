import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USER_INVITATION_RESOLVE_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/user-invitations/resolve',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUserInvitationResolveRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USER_INVITATION_RESOLVE_ROUTE_CONFIG);

export const POST = handleTenantUserInvitationResolveRoute;
