import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('❌ NEXT_PUBLIC_API_URL is not defined ');
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrfToken';
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

const getCookieValue = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const prefix = `${name}=`;
  const parts = document.cookie.split(';');

  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(prefix)) {
      return decodeURIComponent(cookie.slice(prefix.length));
    }
  }

  return '';
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
    const csrfToken = getCookieValue(CSRF_COOKIE);
    if (csrfToken) {
      config.headers = config.headers ?? {};
      config.headers[CSRF_HEADER] = csrfToken;
    }
  }

  return config;
});

export default api;
