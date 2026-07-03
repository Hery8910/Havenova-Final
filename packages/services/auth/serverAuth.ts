import { normalizeAuthSession } from '@/packages/utils';
import type { AuthSessionApiUser, AuthUser } from '@/packages/types';
import { performBackendRequest } from '../bff/backendRequest';

type AuthEnvelope<TUser> = {
  success?: boolean;
  code?: string;
  message?: string;
  user?: TUser;
};

const FORWARDED_AUTH_HEADERS = ['cookie', 'accept-language', 'x-request-id'] as const;

type HeadersLike = {
  get(name: string): string | null;
};

const buildServerAuthHeaders = (requestHeaders: HeadersLike): Headers => {
  const headers = new Headers();
  headers.set('accept', 'application/json');

  for (const headerName of FORWARDED_AUTH_HEADERS) {
    const value = requestHeaders.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  return headers;
};

export const getServerAuthUser = async (requestHeaders: HeadersLike): Promise<AuthUser | null> => {
  try {
    const response = await performBackendRequest({
      method: 'GET',
      path: '/api/auth/me',
      headers: buildServerAuthHeaders(requestHeaders),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AuthEnvelope<AuthSessionApiUser>;
    if (!data?.user) {
      return null;
    }

    return normalizeAuthSession(data.user, {
      isLogged: true,
      isNewUser: data.user.isNewUser ?? false,
    });
  } catch (error) {
    console.error('[dashboard-auth] server auth bootstrap failed', error);
    return null;
  }
};

export const hasDashboardAccess = (auth: AuthUser | null): boolean =>
  Boolean(auth?.isLogged && (auth.role === 'admin' || auth.role === 'super_admin'));

export const hasWorkerAccess = (auth: AuthUser | null): boolean =>
  Boolean(auth?.isLogged && auth.role === 'worker');
