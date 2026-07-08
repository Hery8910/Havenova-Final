import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USERS_INVITE_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/dashboard/users/invite',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUsersInviteRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USERS_INVITE_ROUTE_CONFIG);

export const POST = handleTenantUsersInviteRoute;
