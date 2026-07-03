const DEFAULT_TIMEOUT_MS = 8000;

export type BackendRequestOptions = {
  body?: BodyInit;
  headers?: HeadersInit;
  method: string;
  path: string;
  search?: string;
  timeoutMs?: number;
};

const normalizeBackendBaseUrl = (): string => {
  const raw =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    '';

  const normalized = raw.trim().replace(/\/+$/, '');

  if (!normalized) {
    throw new Error('Backend API base URL is not configured.');
  }

  return normalized;
};

export const buildBackendUrl = (path: string, search = ''): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizeBackendBaseUrl()}${normalizedPath}${search}`;
};

export const performBackendRequest = async ({
  body,
  headers,
  method,
  path,
  search = '',
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: BackendRequestOptions): Promise<Response> =>
  fetch(buildBackendUrl(path, search), {
    method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
  });
