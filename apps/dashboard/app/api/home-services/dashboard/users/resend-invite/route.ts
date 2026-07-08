import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USERS_RESEND_INVITE_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/dashboard/users/resend-invite',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUsersResendInviteRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USERS_RESEND_INVITE_ROUTE_CONFIG);

export const POST = handleTenantUsersResendInviteRoute;
