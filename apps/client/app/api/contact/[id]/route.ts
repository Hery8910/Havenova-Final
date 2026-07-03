import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

type ContactMessageRouteContext = {
  params: {
    id?: string;
  };
};

export const dynamic = 'force-dynamic';

export const DELETE = (request: NextRequest, context: ContactMessageRouteContext) => {
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
    methods: ['DELETE'],
    upstreamPath: `/api/contact/${encodeURIComponent(id)}`,
    forwardRequestHeaders: ['cookie', 'authorization', 'x-request-id', 'accept-language'],
  });
};
