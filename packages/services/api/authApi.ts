import { getCsrfToken, setCsrfToken } from './csrfTokenStore';
import sameOriginApi from './sameOriginApi';

const authApi = sameOriginApi;

const CSRF_HEADER = 'x-csrf-token';

const csrfProtectedRoutes = new Set([
  '/api/auth/refresh-token',
  '/api/auth/update-password',
  '/api/auth/change-email',
  '/api/auth/logout',
  '/api/auth/logout-all-sessions',
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

const updateCsrfTokenFromHeaders = (headers: unknown) => {
  const nextToken = getHeaderValue(headers, CSRF_HEADER);
  if (!nextToken) return;
  setCsrfToken(nextToken);
};

authApi.interceptors.request.use((config) => {
  const method = (config.method || 'get').toUpperCase();
  const path = normalizePathname(config.url);

  if (method === 'POST' && csrfProtectedRoutes.has(path)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers = config.headers ?? {};
      config.headers[CSRF_HEADER] = csrfToken;
    }
  }

  return config;
});

authApi.interceptors.response.use((response) => {
  updateCsrfTokenFromHeaders(response.headers);
  return response;
});

export default authApi;
