import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const TENANT_USERS_SUMMARY_ROUTE_CONFIG = {
  methods: ['GET'],
  upstreamPath: '/api/home-services/dashboard/users/summary',
} as const;

export const dynamic = 'force-dynamic';

const handleTenantUsersSummaryRoute = (request: NextRequest) =>
  proxyBackendRoute(request, TENANT_USERS_SUMMARY_ROUTE_CONFIG);

export const GET = handleTenantUsersSummaryRoute;
