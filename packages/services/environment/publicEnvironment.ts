import { normalizeEnvironmentValue, resolveEnvironmentMode } from './runtimeMode';

export type PublicEnvironmentInput = {
  nodeEnv?: string;
  publicAllowedHosts?: string;
  publicTenantKey?: string;
  publicTenantKeyFallback?: string;
};

export const DEMO_TENANT_KEY = 'tnk_demo_havenova';

const toPublicEnvironmentError = (variable: string, reason: string): Error =>
  new Error(`Invalid environment configuration: ${variable} ${reason}.`);

const normalizeAllowedHost = (value: string): string => {
  const raw = normalizeEnvironmentValue(value).toLowerCase();

  if (
    !raw ||
    raw.includes('://') ||
    raw.includes('/') ||
    raw.includes('?') ||
    raw.includes('#') ||
    raw.includes('*')
  ) {
    throw toPublicEnvironmentError(
      'NEXT_PUBLIC_ALLOWED_HOSTS',
      'must contain hosts without scheme, path, or wildcards'
    );
  }

  try {
    const url = new URL(`http://${raw}`);
    if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
      throw new Error('invalid host');
    }

    return url.hostname.toLowerCase();
  } catch {
    throw toPublicEnvironmentError('NEXT_PUBLIC_ALLOWED_HOSTS', 'contains an invalid host');
  }
};

export const resolveAllowedHosts = (input: PublicEnvironmentInput): string[] => {
  const raw = normalizeEnvironmentValue(input.publicAllowedHosts);

  if (!raw) {
    if (resolveEnvironmentMode(input.nodeEnv) === 'production') {
      throw toPublicEnvironmentError('NEXT_PUBLIC_ALLOWED_HOSTS', 'is required in production');
    }

    return [];
  }

  return [...new Set(raw.split(',').map(normalizeAllowedHost))];
};

export const resolveTenantKeyFromEnvironment = (input: PublicEnvironmentInput): string => {
  const tenantKey =
    normalizeEnvironmentValue(input.publicTenantKey) ||
    normalizeEnvironmentValue(input.publicTenantKeyFallback);

  if (tenantKey) {
    return tenantKey;
  }

  if (resolveEnvironmentMode(input.nodeEnv) !== 'production') {
    return DEMO_TENANT_KEY;
  }

  throw toPublicEnvironmentError(
    'NEXT_PUBLIC_TENANT_KEY',
    'or NEXT_PUBLIC_TENANT_KEY_FALLBACK is required in production'
  );
};
