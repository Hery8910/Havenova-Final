import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type TenantUserRouteContext = {
  params: {
    userClientId: string;
  };
};

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest, context: TenantUserRouteContext) =>
  proxyBackendRoute(request, {
    methods: ['GET'],
    upstreamPath: `/api/home-services/dashboard/users/${encodeURIComponent(
      context.params.userClientId
    )}`,
  });
