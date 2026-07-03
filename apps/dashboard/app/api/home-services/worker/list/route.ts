import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const WORKER_LIST_ROUTE_CONFIG = {
  methods: ['GET'],
  upstreamPath: '/api/home-services/worker/list',
} as const;

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest) =>
  proxyBackendRoute(request, WORKER_LIST_ROUTE_CONFIG);
