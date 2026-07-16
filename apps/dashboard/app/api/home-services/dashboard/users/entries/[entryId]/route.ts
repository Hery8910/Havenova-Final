import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type TenantUserEntryRouteContext = {
  params: {
    entryId: string;
  };
};

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest, context: TenantUserEntryRouteContext) =>
  proxyBackendRoute(request, {
    methods: ['GET'],
    upstreamPath: `/api/home-services/dashboard/users/entries/${encodeURIComponent(
      context.params.entryId
    )}`,
  });
