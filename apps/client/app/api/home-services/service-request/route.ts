import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const SERVICE_REQUEST_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/service-request',
} as const;

export const dynamic = 'force-dynamic';

export const POST = (request: NextRequest) =>
  proxyBackendRoute(request, SERVICE_REQUEST_ROUTE_CONFIG);
