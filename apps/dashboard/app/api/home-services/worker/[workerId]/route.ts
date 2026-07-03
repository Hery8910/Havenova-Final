import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type WorkerRouteContext = {
  params: {
    workerId?: string;
  };
};

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest, context: WorkerRouteContext) => {
  const workerId = context.params.workerId?.trim();

  if (!workerId) {
    return Response.json(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'workerId is required.',
      },
      { status: 400 }
    );
  }

  return proxyBackendRoute(request, {
    methods: ['GET'],
    upstreamPath: `/api/home-services/worker/${encodeURIComponent(workerId)}`,
  });
};
