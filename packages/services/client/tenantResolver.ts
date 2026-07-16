import { resolveTenantKeyFromEnvironment } from '../environment/publicEnvironment';

const normalize = (value?: string | null): string => (value ?? '').trim();

export function resolveTenantKey(explicitTenantKey?: string): string {
  const explicit = normalize(explicitTenantKey);
  if (explicit) return explicit;

  return resolveTenantKeyFromEnvironment({
    nodeEnv: process.env.NODE_ENV,
    publicTenantKey: process.env.NEXT_PUBLIC_TENANT_KEY,
    publicTenantKeyFallback: process.env.NEXT_PUBLIC_TENANT_KEY_FALLBACK,
  });
}
