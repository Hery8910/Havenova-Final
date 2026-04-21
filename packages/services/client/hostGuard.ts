const DEV_LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

const normalizeHost = (value?: string | null): string => {
  const raw = (value ?? '').split(',')[0]?.trim().toLowerCase() ?? '';
  if (!raw) return '';

  // IPv6 host headers may come as [::1]:3000
  if (raw.startsWith('[')) {
    const end = raw.indexOf(']');
    return end > 0 ? raw.slice(0, end + 1) : raw;
  }

  // domain:port or ipv4:port
  const [host] = raw.split(':');
  return host?.trim() ?? '';
};

const parseAllowedHosts = (value?: string): string[] =>
  (value ?? '')
    .split(',')
    .map((item) => normalizeHost(item))
    .filter(Boolean);

const toHostValidationError = (message: string) => {
  const error: Error & { response?: { status: number; data: { code: string; message: string } } } =
    new Error(message);
  error.response = {
    status: 403,
    data: {
      code: 'AUTH_FORBIDDEN',
      message,
    },
  };
  return error;
};

export function resolveRequestHost(headersLike: { get(name: string): string | null }): string {
  return normalizeHost(headersLike.get('x-forwarded-host') || headersLike.get('host'));
}

export function assertAllowedAppHost(requestHost: string): void {
  const allowedHosts = parseAllowedHosts(process.env.NEXT_PUBLIC_ALLOWED_HOSTS);
  const isProd = process.env.NODE_ENV === 'production';

  if (!requestHost) {
    throw toHostValidationError('Missing request host.');
  }

  if (allowedHosts.includes(requestHost)) {
    return;
  }

  if (!isProd && DEV_LOCAL_HOSTS.has(requestHost)) {
    return;
  }

  if (isProd && allowedHosts.length === 0) {
    throw toHostValidationError(
      'Host allowlist is empty in production. Configure NEXT_PUBLIC_ALLOWED_HOSTS.'
    );
  }

  throw toHostValidationError(`Host "${requestHost}" is not allowed for this app.`);
}

