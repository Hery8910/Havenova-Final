import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const WORKER_ROUTE_CONFIG = {
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  upstreamPath: '/api/home-services/worker',
} as const;

export const dynamic = 'force-dynamic';

const handleWorkerRoute = (request: NextRequest) =>
  proxyBackendRoute(request, WORKER_ROUTE_CONFIG);

export const GET = handleWorkerRoute;
export const POST = handleWorkerRoute;
export const PATCH = handleWorkerRoute;
export const DELETE = handleWorkerRoute;
