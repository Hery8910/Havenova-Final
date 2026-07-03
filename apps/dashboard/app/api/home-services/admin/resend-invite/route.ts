import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const ADMIN_RESEND_INVITE_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/admin/resend-invite',
} as const;

export const dynamic = 'force-dynamic';

const handleAdminResendInviteRoute = (request: NextRequest) =>
  proxyBackendRoute(request, ADMIN_RESEND_INVITE_ROUTE_CONFIG);

export const POST = handleAdminResendInviteRoute;
