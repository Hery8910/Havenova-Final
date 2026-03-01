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

const csrfProtectedRoutes = new Set([
  '/api/auth/refresh-token',
  '/api/auth/update-password',
  '/api/auth/change-email',
  '/api/auth/logout',
  '/api/auth/logout-all-sessions',
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
