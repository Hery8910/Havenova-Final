import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type ContactMessageRespondRouteContext = {
  params: {
    id?: string;
  };
};

export const dynamic = 'force-dynamic';

export const PATCH = (request: NextRequest, context: ContactMessageRespondRouteContext) => {
  const id = context.params.id?.trim();

  if (!id) {
    return Response.json(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'contact message id is required.',
      },
      { status: 400 }
    );
  }

  return proxyBackendRoute(request, {
    methods: ['PATCH'],
    upstreamPath: `/api/contact/${encodeURIComponent(id)}/respond`,
    forwardRequestHeaders: ['cookie', 'authorization', 'x-request-id', 'accept-language'],
  });
};
