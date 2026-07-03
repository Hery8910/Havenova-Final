import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const ADMIN_ROUTE_CONFIG = {
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  upstreamPath: '/api/home-services/admin',
} as const;

export const dynamic = 'force-dynamic';

const handleAdminRoute = (request: NextRequest) => proxyBackendRoute(request, ADMIN_ROUTE_CONFIG);

export const GET = handleAdminRoute;
export const POST = handleAdminRoute;
export const PATCH = handleAdminRoute;
export const DELETE = handleAdminRoute;
