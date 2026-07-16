import {
  DEMO_TENANT_KEY,
  resolveAllowedHosts,
  resolveTenantKeyFromEnvironment,
} from '@/packages/services/environment/publicEnvironment';
import { resolveBackendApiUrl } from '@/packages/services/environment/serverEnvironment';
import { resolveTenantKey } from '@/packages/services/client/tenantResolver';

const originalEnvironment = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe('environment validation', () => {
  it('requires canonical production variables without exposing values', () => {
    expect(() => resolveBackendApiUrl({ nodeEnv: 'production' })).toThrow(
      'BACKEND_API_URL is required in production'
    );
  });

  it('rejects invalid backend URLs without including the configured value', () => {
    const secretLikeValue = 'https://token-value.example.invalid/path';
    let message = '';

    try {
      resolveBackendApiUrl({
        backendApiUrl: secretLikeValue,
        nodeEnv: 'production',
      });
    } catch (error) {
      message = error instanceof Error ? error.message : '';
    }

    expect(message).toContain('BACKEND_API_URL must be a base HTTP(S) URL without a path');
    expect(message).not.toContain(secretLikeValue);
  });

  it.each([
    'ftp://api.example.invalid',
    'https://user:password@api.example.invalid',
    'https://api.example.invalid?token=value',
    'https://api.example.invalid#fragment',
  ])('rejects disallowed backend URL parts without echoing them', (value) => {
    let message = '';

    try {
      resolveBackendApiUrl({ backendApiUrl: value, nodeEnv: 'production' });
    } catch (error) {
      message = error instanceof Error ? error.message : '';
    }

    expect(message).toContain('BACKEND_API_URL');
    expect(message).not.toContain(value);
  });

  it('rejects invalid public host allowlists', () => {
    expect(() =>
      resolveAllowedHosts({
        nodeEnv: 'production',
        publicAllowedHosts: 'https://client.example.invalid',
      })
    ).toThrow('NEXT_PUBLIC_ALLOWED_HOSTS must contain hosts without scheme, path, or wildcards');

    expect(() =>
      resolveAllowedHosts({
        nodeEnv: 'production',
        publicAllowedHosts: '*.example.invalid',
      })
    ).toThrow('NEXT_PUBLIC_ALLOWED_HOSTS must contain hosts without scheme, path, or wildcards');
  });

  it('returns normalized configuration lazily by consumer', () => {
    expect(
      resolveAllowedHosts({
        nodeEnv: 'production',
        publicAllowedHosts: ' CLIENT.example.invalid:443 , dashboard.example.invalid ',
      })
    ).toEqual(['client.example.invalid', 'dashboard.example.invalid']);
    expect(
      resolveBackendApiUrl({ backendApiUrl: 'https://api.example.invalid/', nodeEnv: 'production' })
    ).toBe('https://api.example.invalid');
    expect(
      resolveTenantKeyFromEnvironment({
        nodeEnv: 'production',
        publicTenantKey: 'tnk_example_invalid',
      })
    ).toBe('tnk_example_invalid');
  });

  it('keeps the explicit development tenant fallback', () => {
    expect(resolveTenantKeyFromEnvironment({ nodeEnv: 'development' })).toBe(DEMO_TENANT_KEY);
  });

  it('requires a tenant key or documented fallback in production', () => {
    expect(() => resolveTenantKeyFromEnvironment({ nodeEnv: 'production' })).toThrow(
      'NEXT_PUBLIC_TENANT_KEY or NEXT_PUBLIC_TENANT_KEY_FALLBACK is required in production'
    );
  });

  it('uses tenant key sources in documented order', () => {
    expect(
      resolveTenantKeyFromEnvironment({
        nodeEnv: 'production',
        publicTenantKey: 'tnk_primary',
        publicTenantKeyFallback: 'tnk_fallback',
      })
    ).toBe('tnk_primary');
    expect(
      resolveTenantKeyFromEnvironment({
        nodeEnv: 'production',
        publicTenantKeyFallback: 'tnk_fallback',
      })
    ).toBe('tnk_fallback');
  });

  it('keeps explicit tenant input ahead of public environment values', () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_TENANT_KEY = 'tnk_primary';
    process.env.NEXT_PUBLIC_TENANT_KEY_FALLBACK = 'tnk_fallback';

    expect(resolveTenantKey('tnk_explicit')).toBe('tnk_explicit');
    expect(resolveTenantKey()).toBe('tnk_primary');
  });

  it('does not depend on personal test environment values', () => {
    process.env.BACKEND_API_URL = 'https://personal.example.invalid';

    expect(resolveBackendApiUrl({ nodeEnv: 'test' })).toBeUndefined();
    expect(resolveTenantKeyFromEnvironment({ nodeEnv: 'test' })).toBe(DEMO_TENANT_KEY);
  });

  it('keeps documented legacy backend fallbacks', () => {
    expect(
      resolveBackendApiUrl({
        legacyApiUrl: 'https://legacy.example.invalid/',
        nodeEnv: 'production',
      })
    ).toBe('https://legacy.example.invalid');
  });

  it('prefers the server-only backend URL over public legacy fallbacks', () => {
    expect(
      resolveBackendApiUrl({
        backendApiUrl: 'https://api.example.invalid',
        legacyApiUrl: 'https://legacy.example.invalid',
        nodeEnv: 'production',
      })
    ).toBe('https://api.example.invalid');
  });
});
