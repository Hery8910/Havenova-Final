import type { AuthUser } from '@/packages/types';

export type AuthSessionSeed = Partial<AuthUser> & {
  authId?: string;
  userClientId?: string;
};

type LoggedOutAuthSeedOptions = {
  clientId?: string;
  email?: string;
  role?: AuthUser['role'];
  status?: AuthUser['status'];
  isVerified?: boolean;
  isNewUser?: boolean;
  tosAccepted?: AuthUser['tosAccepted'];
  cookiePrefs?: AuthUser['cookiePrefs'];
};

export function normalizeAuthSession(
  value?: AuthSessionSeed | null,
  fallbacks?: Partial<AuthUser>
): AuthUser {
  const sessionIdentity = value?.userClientId || fallbacks?.userClientId || '';

  return {
    authId: value?.authId ?? fallbacks?.authId ?? '',
    userClientId: sessionIdentity,
    clientId: value?.clientId ?? fallbacks?.clientId ?? '',
    email: value?.email ?? fallbacks?.email ?? '',
    role: value?.role ?? fallbacks?.role ?? 'guest',
    status: value?.status ?? fallbacks?.status ?? 'active',
    isVerified: value?.isVerified ?? fallbacks?.isVerified ?? false,
    isLogged: value?.isLogged ?? fallbacks?.isLogged ?? false,
    isNewUser: value?.isNewUser ?? fallbacks?.isNewUser ?? true,
    tosAccepted: value?.tosAccepted ?? fallbacks?.tosAccepted,
    cookiePrefs: value?.cookiePrefs ?? fallbacks?.cookiePrefs,
  };
}

export function createLoggedOutAuthSeed(
  options: LoggedOutAuthSeedOptions = {}
): AuthSessionSeed {
  return {
    authId: '',
    userClientId: '',
    clientId: options.clientId ?? '',
    email: options.email ?? '',
    role: options.role ?? 'guest',
    status: options.status ?? 'active',
    isVerified: options.isVerified ?? false,
    isLogged: false,
    isNewUser: options.isNewUser ?? false,
    tosAccepted: options.tosAccepted,
    cookiePrefs: options.cookiePrefs,
  };
}
