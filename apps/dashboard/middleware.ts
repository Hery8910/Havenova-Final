import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { buildBackendUrl } from '../../packages/services/bff/backendRequest';
import {
  applyAuthCookiesFromBackend,
  readAuthCookiesFromBackendResponse,
  type ParsedAuthCookie,
} from '../../packages/services/bff/authCookieBridge';

const SUPPORTED = ['de', 'en', 'es'] as const;
const DEFAULT_LANG = 'de';
const AUTH_FORWARD_HEADERS = ['cookie', 'accept-language', 'x-request-id'] as const;
const SESSION_GUARD_TIMEOUT_MS = 8000;
const CSRF_HEADER = 'x-csrf-token';

const getHeaderValue = (headers: Headers, name: string): string => headers.get(name)?.trim() || '';

const isLocalizedPath = (pathname: string) =>
  SUPPORTED.some((lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`));

const resolveLocalizedPath = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.[^/]+$/)) {
    return null;
  }

  if (isLocalizedPath(pathname)) {
    return pathname;
  }

  const cookieLang = req.cookies.get('lang')?.value;
  if (cookieLang && SUPPORTED.includes(cookieLang as (typeof SUPPORTED)[number])) {
    return `/${cookieLang}${pathname}`;
  }

  const header = req.headers.get('accept-language') || '';
  const normalizedHeader = header.toLowerCase();
  const preferred = normalizedHeader.startsWith('de')
    ? 'de'
    : normalizedHeader.startsWith('es')
      ? 'es'
      : 'en';
  const lang = SUPPORTED.includes(preferred as (typeof SUPPORTED)[number]) ? preferred : DEFAULT_LANG;

  return `/${lang}${pathname}`;
};

const isProtectedDashboardPath = (pathname: string) => {
  const match = pathname.match(/^\/(de|en|es)(\/.*)?$/);
  if (!match) return false;

  const suffix = match[2] || '';
  if (!suffix || suffix === '/') {
    return true;
  }

  return !suffix.startsWith('/user');
};

const buildServerAuthHeaders = (request: NextRequest, cookieHeader?: string): Headers => {
  const headers = new Headers();
  headers.set('accept', 'application/json');

  for (const headerName of AUTH_FORWARD_HEADERS) {
    if (headerName === 'cookie') {
      const value = cookieHeader ?? request.headers.get('cookie');
      if (value) {
        headers.set(headerName, value);
      }
      continue;
    }

    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
};

const mergeCookieHeader = (
  request: NextRequest,
  authCookies: ParsedAuthCookie[]
): string => {
  const cookieStore = new Map<string, string>();

  for (const cookie of request.cookies.getAll()) {
    cookieStore.set(cookie.name, cookie.value);
  }

  for (const cookie of authCookies) {
    const isExpired =
      cookie.maxAge === 0 ||
      (cookie.expires instanceof Date && cookie.expires.getTime() <= Date.now());

    if (isExpired) {
      cookieStore.delete(cookie.name);
      continue;
    }

    cookieStore.set(cookie.name, cookie.value);
  }

  return Array.from(cookieStore.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
};

const performSessionGuard = async (request: NextRequest) => {
  const meResponse = await fetch(buildBackendUrl('/api/auth/me'), {
    method: 'GET',
    headers: buildServerAuthHeaders(request),
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(SESSION_GUARD_TIMEOUT_MS),
  });

  if (meResponse.ok) {
    return null;
  }

  if (meResponse.status !== 401 && meResponse.status !== 403) {
    return null;
  }

  const refreshToken = request.cookies.get('refreshToken')?.value?.trim();
  if (!refreshToken) {
    return null;
  }

  const csrfResponse = await fetch(buildBackendUrl('/api/auth/csrf'), {
    method: 'GET',
    headers: buildServerAuthHeaders(request),
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(SESSION_GUARD_TIMEOUT_MS),
  });

  if (!csrfResponse.ok) {
    return null;
  }

  const csrfHeader = getHeaderValue(csrfResponse.headers, CSRF_HEADER);
  if (!csrfHeader) {
    return null;
  }

  const csrfCookies = readAuthCookiesFromBackendResponse(csrfResponse);
  const csrfCookieHeader =
    csrfCookies.length > 0 ? mergeCookieHeader(request, csrfCookies) : undefined;
  const refreshHeaders = buildServerAuthHeaders(request, csrfCookieHeader);
  refreshHeaders.set(CSRF_HEADER, csrfHeader);

  const refreshResponse = await fetch(buildBackendUrl('/api/auth/refresh-token'), {
    method: 'POST',
    headers: refreshHeaders,
    body: '{}',
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(SESSION_GUARD_TIMEOUT_MS),
  });

  if (!refreshResponse.ok) {
    return null;
  }

  const authCookies = readAuthCookiesFromBackendResponse(refreshResponse);
  const forwardedHeaders = new Headers(request.headers);
  const cookieHeader = authCookies.length > 0 ? mergeCookieHeader(request, authCookies) : '';

  if (cookieHeader) {
    forwardedHeaders.set('cookie', cookieHeader);
  } else {
    forwardedHeaders.delete('cookie');
  }

  const updatedCsrfToken = getHeaderValue(refreshResponse.headers, CSRF_HEADER);
  if (updatedCsrfToken) {
    forwardedHeaders.set(CSRF_HEADER, updatedCsrfToken);
  }

  const response = NextResponse.next({
    request: {
      headers: forwardedHeaders,
    },
  });

  applyAuthCookiesFromBackend(refreshResponse, response);
  return response;
};

export async function middleware(req: NextRequest) {
  const localizedPath = resolveLocalizedPath(req);

  if (!localizedPath) {
    return NextResponse.next();
  }

  if (localizedPath !== req.nextUrl.pathname) {
    return NextResponse.redirect(new URL(localizedPath, req.url));
  }

  if (!isProtectedDashboardPath(localizedPath)) {
    return NextResponse.next();
  }

  try {
    const guardedResponse = await performSessionGuard(req);
    if (guardedResponse) {
      return guardedResponse;
    }
  } catch (error) {
    console.error('[dashboard-middleware] auth session guard failed', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
