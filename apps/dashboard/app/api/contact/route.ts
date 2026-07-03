import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const CONTACT_ROUTE_CONFIG = {
  methods: ['GET', 'POST', 'DELETE'],
  upstreamPath: '/api/contact',
  forwardRequestHeaders: ['cookie', 'authorization', 'x-request-id', 'accept-language'],
} as const;

export const dynamic = 'force-dynamic';

const handleContactRoute = (request: NextRequest) =>
  proxyBackendRoute(request, CONTACT_ROUTE_CONFIG);

export const GET = handleContactRoute;
export const POST = handleContactRoute;
export const DELETE = handleContactRoute;
