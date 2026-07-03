import axios from 'axios';
import { getCsrfToken, setCsrfToken } from './csrfTokenStore';

// Transitional browser-direct backend client.
// New domains should prefer same-origin frontend routes backed by the BFF layer.
const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: baseURL || undefined,
  withCredentials: true,
});

const CSRF_HEADER = 'x-csrf-token';
const FRONTEND_ORIGIN_HEADER = 'x-frontend-origin';

const csrfProtectedRoutes = new Set([
  '/api/auth/refresh-token',
  '/api/auth/update-password',
  '/api/auth/change-email',
  '/api/auth/logout',
  '/api/auth/logout-all-sessions',
]);

const authOriginProtectedRoutes = new Set([
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/resend-verification',
  '/api/auth/change-email',
]);

const getHeaderValue = (headers: unknown, name: string): string => {
  if (!headers) return '';

  if (typeof headers === 'object' && headers !== null && 'get' in headers) {
    const getter = headers as { get?: (key: string) => string | null | undefined };
    const value = getter.get?.(name);
    return typeof value === 'string' ? value : '';
  }

  const record = headers as Record<string, unknown>;
  const direct = record[name] ?? record[name.toLowerCase()] ?? record[name.toUpperCase()];

  return typeof direct === 'string' ? direct : '';
};

const updateCsrfTokenFromHeaders = (headers: unknown) => {
  const nextToken = getHeaderValue(headers, CSRF_HEADER);
  if (!nextToken) return;
  setCsrfToken(nextToken);
};

const getFrontendOrigin = (): string => {
  if (typeof window === 'undefined' || !window.location?.origin) return '';

  try {
    const parsed = new URL(window.location.origin);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.origin : '';
  } catch {
    return '';
  }
};

const normalizePathname = (url?: string): string => {
  if (!url) return '';
  const withoutQuery = url.split('?')[0] || '';

  if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) {
    try {
      return new URL(withoutQuery).pathname;
    } catch {
      return withoutQuery;
    }
  }

  return withoutQuery;
};

api.interceptors.request.use((config) => {
  if (!baseURL) {
    throw new Error('❌ NEXT_PUBLIC_API_URL is not defined');
  }

  const method = (config.method || 'get').toUpperCase();
  const path = normalizePathname(config.url);

  if (method === 'POST' && authOriginProtectedRoutes.has(path)) {
    const frontendOrigin = getFrontendOrigin();
    if (frontendOrigin) {
      config.headers = config.headers ?? {};
      config.headers[FRONTEND_ORIGIN_HEADER] = frontendOrigin;
    }
  }

  if (method === 'POST' && csrfProtectedRoutes.has(path)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers = config.headers ?? {};
      config.headers[CSRF_HEADER] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use((response) => {
  updateCsrfTokenFromHeaders(response.headers);
  return response;
});

export default api;
