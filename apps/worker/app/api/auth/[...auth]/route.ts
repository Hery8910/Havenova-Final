import { NextRequest } from 'next/server';
import { handleAuthBffRoute } from '@/packages/services/bff/authBffRoute';

type AuthRouteContext = {
  params: {
    auth?: string[];
  };
};

export const dynamic = 'force-dynamic';

export const GET = (request: NextRequest, context: AuthRouteContext) =>
  handleAuthBffRoute(request, context);

export const POST = (request: NextRequest, context: AuthRouteContext) =>
  handleAuthBffRoute(request, context);

export const PATCH = (request: NextRequest, context: AuthRouteContext) =>
  handleAuthBffRoute(request, context);

export const DELETE = (request: NextRequest, context: AuthRouteContext) =>
  handleAuthBffRoute(request, context);
