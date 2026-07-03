import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const PROFILE_ROUTE_CONFIG = {
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  upstreamPath: '/api/home-services/profile',
} as const;

export const dynamic = 'force-dynamic';

const handleProfileRoute = (request: NextRequest) =>
  proxyBackendRoute(request, PROFILE_ROUTE_CONFIG);

export const GET = handleProfileRoute;
export const POST = handleProfileRoute;
export const PATCH = handleProfileRoute;
export const DELETE = handleProfileRoute;
