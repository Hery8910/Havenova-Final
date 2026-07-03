import { NextRequest, NextResponse } from 'next/server';
import { applyAuthCookiesFromBackend } from './authCookieBridge';
import { jsonProxyError, proxyBackendRoute, ProxyRouteConfig } from './backendProxyRoute';

const AUTH_ROUTE_CONFIG: Record<string, ProxyRouteConfig> = {
  'change-email': {
    methods: ['POST'],
    allowFrontendOrigin: true,
    upstreamPath: '/api/auth/change-email',
  },
  'change-email/confirm': {
    methods: ['POST'],
    upstreamPath: '/api/auth/change-email/confirm',
  },
  'forgot-password': {
    methods: ['POST'],
    allowFrontendOrigin: true,
    upstreamPath: '/api/auth/forgot-password',
  },
  'invite/resolve': {
    methods: ['POST'],
    upstreamPath: '/api/auth/invite/resolve',
  },
  login: {
    methods: ['POST'],
    allowFrontendOrigin: true,
    upstreamPath: '/api/auth/login',
  },
  'logout-all-sessions': {
    methods: ['POST'],
    upstreamPath: '/api/auth/logout-all-sessions',
  },
  logout: {
    methods: ['POST'],
    upstreamPath: '/api/auth/logout',
  },
  'magic-login': {
    methods: ['POST'],
    upstreamPath: '/api/auth/magic-login',
  },
  me: {
    methods: ['GET'],
    upstreamPath: '/api/auth/me',
  },
  'refresh-token': {
    methods: ['POST'],
    upstreamPath: '/api/auth/refresh-token',
  },
  register: {
    methods: ['POST'],
    allowFrontendOrigin: true,
    upstreamPath: '/api/auth/register',
  },
  'resend-verification': {
    methods: ['POST'],
    allowFrontendOrigin: true,
    upstreamPath: '/api/auth/resend-verification',
  },
  'reset-password-confirm': {
    methods: ['POST'],
    upstreamPath: '/api/auth/reset-password-confirm',
  },
  'update-password': {
    methods: ['POST'],
    upstreamPath: '/api/auth/update-password',
  },
  'verify-email': {
    methods: ['POST'],
    upstreamPath: '/api/auth/verify-email',
  },
};

const normalizeAuthPath = (segments: string[] | undefined): string =>
  (segments ?? []).map((segment) => segment.trim()).filter(Boolean).join('/');

export const handleAuthBffRoute = async (
  request: NextRequest,
  context: { params: { auth?: string[] } }
) => {
  const authPath = normalizeAuthPath(context.params.auth);
  const config = AUTH_ROUTE_CONFIG[authPath];

  if (!config) {
    return jsonProxyError(404, 'AUTH_BFF_ROUTE_NOT_FOUND', 'Unsupported auth BFF route.');
  }

  const baseResponse = await proxyBackendRoute(request, config, (response, backendResponse) => {
    applyAuthCookiesFromBackend(backendResponse, response);
  });

  if (!baseResponse.headers.get('content-type')?.includes('application/json')) {
    return baseResponse;
  }

  if (baseResponse.status === 405) {
    const payload = await baseResponse.json();
    return NextResponse.json({ ...payload, code: 'AUTH_BFF_METHOD_NOT_ALLOWED' }, { status: 405 });
  }

  if (baseResponse.status === 502) {
    const payload = await baseResponse.json();
    return NextResponse.json({ ...payload, code: 'AUTH_BFF_UPSTREAM_UNAVAILABLE' }, { status: 502 });
  }

  return baseResponse;
};
