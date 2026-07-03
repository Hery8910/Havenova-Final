import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type ClientTenantRouteContext = {
  params: {
    tenantKey?: string;
  };
};

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest, context: ClientTenantRouteContext) => {
  const tenantKey = context.params.tenantKey?.trim();

  if (!tenantKey) {
    return Response.json(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'tenantKey is required.',
      },
      { status: 400 }
    );
  }

  return proxyBackendRoute(request, {
    methods: ['GET'],
    upstreamPath: `/api/clients/tenant/${encodeURIComponent(tenantKey)}`,
  });
};
