import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USERS_DIRECTORY_ROUTE_CONFIG = {
  methods: ['GET'],
  upstreamPath: '/api/home-services/dashboard/users/directory',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUsersDirectoryRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USERS_DIRECTORY_ROUTE_CONFIG);

export const GET = handleTenantUsersDirectoryRoute;
