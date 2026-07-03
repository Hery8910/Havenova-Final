import { NextRequest } from 'next/server';
import { proxyBackendRoute } from '@/packages/services/bff';

const WORKER_RESEND_INVITE_ROUTE_CONFIG = {
  methods: ['POST'],
  upstreamPath: '/api/home-services/worker/resend-invite',
} as const;

export const dynamic = 'force-dynamic';

export const POST = (request: NextRequest) =>
  proxyBackendRoute(request, WORKER_RESEND_INVITE_ROUTE_CONFIG);
