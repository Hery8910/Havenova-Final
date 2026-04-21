const DEMO_TENANT_KEY = 'tnk_demo_havenova';

const normalize = (value?: string | null): string => (value ?? '').trim();

export function resolveTenantKey(explicitTenantKey?: string): string {
  const explicit = normalize(explicitTenantKey);
  if (explicit) return explicit;

  const primary = normalize(process.env.NEXT_PUBLIC_TENANT_KEY);
  if (primary) return primary;

  const fallback = normalize(process.env.NEXT_PUBLIC_TENANT_KEY_FALLBACK);
  if (fallback) return fallback;

  if (process.env.NODE_ENV !== 'production') {
    return DEMO_TENANT_KEY;
  }

  throw new Error(
    'Tenant key is missing in production. Configure NEXT_PUBLIC_TENANT_KEY or NEXT_PUBLIC_TENANT_KEY_FALLBACK.'
  );
}

