import { NextRequest, NextResponse } from 'next/server';
import { performBackendRequest } from './backendRequest';

export type ProxyRouteConfig = {
  allowFrontendOrigin?: boolean;
  forwardRequestHeaders?: readonly string[];
  forwardResponseHeaders?: readonly string[];
  methods: readonly string[];
  upstreamPath: string;
};

const DEFAULT_FORWARDED_REQUEST_HEADERS = [
  'cookie',
  'x-csrf-token',
  'x-request-id',
  'accept-language',
];
const DEFAULT_FORWARDED_RESPONSE_HEADERS = ['content-type', 'x-csrf-token', 'x-request-id'];

export const jsonProxyError = (status: number, code: string, message: string) =>
  NextResponse.json(
    {
      success: false,
      code,
      message,
    },
    { status }
  );

export const resolveFrontendOrigin = (request: NextRequest): string => {
  const originHeader = request.headers.get('origin')?.trim();
  if (originHeader) return originHeader;

  const proto = request.headers.get('x-forwarded-proto')?.trim() || 'https';
  const host = request.headers.get('x-forwarded-host')?.trim() || request.headers.get('host')?.trim();

  return host ? `${proto}://${host}` : '';
};

export const buildProxyHeaders = (
  request: NextRequest,
  config: Pick<ProxyRouteConfig, 'allowFrontendOrigin' | 'forwardRequestHeaders'>,
  bodyText: string
): Headers => {
  const headers = new Headers();
  headers.set('accept', 'application/json');

  for (const headerName of config.forwardRequestHeaders ?? DEFAULT_FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  if (bodyText) {
    headers.set('content-type', request.headers.get('content-type') || 'application/json');
  }

  if (config.allowFrontendOrigin) {
    const frontendOrigin = resolveFrontendOrigin(request);
    if (frontendOrigin) {
      headers.set('x-frontend-origin', frontendOrigin);
    }
  }

  return headers;
};

export const createProxyBrowserResponse = async (
  backendResponse: Response,
  forwardedResponseHeaders: readonly string[] = DEFAULT_FORWARDED_RESPONSE_HEADERS,
  mutate?: (response: NextResponse, backendResponse: Response) => void
): Promise<NextResponse> => {
  const responseBody = await backendResponse.text();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
  });

  for (const headerName of forwardedResponseHeaders) {
    const value = backendResponse.headers.get(headerName);
    if (value) {
      response.headers.set(headerName, value);
    }
  }

  mutate?.(response, backendResponse);

  return response;
};

export const proxyBackendRoute = async (
  request: NextRequest,
  config: ProxyRouteConfig,
  mutate?: (response: NextResponse, backendResponse: Response) => void
) => {
  if (!config.methods.includes(request.method.toUpperCase())) {
    return jsonProxyError(
      405,
      'BFF_METHOD_NOT_ALLOWED',
      `Method ${request.method.toUpperCase()} is not allowed for this route.`
    );
  }

  const bodyText = request.method.toUpperCase() === 'GET' ? '' : await request.text();

  try {
    const backendResponse = await performBackendRequest({
      method: request.method.toUpperCase(),
      path: config.upstreamPath,
      search: request.nextUrl.search,
      headers: buildProxyHeaders(request, config, bodyText),
      body: bodyText || undefined,
    });

    return createProxyBrowserResponse(
      backendResponse,
      config.forwardResponseHeaders,
      mutate
    );
  } catch (error) {
    console.error('[bff] upstream request failed', {
      upstreamPath: config.upstreamPath,
      method: request.method.toUpperCase(),
      error,
    });

    return jsonProxyError(
      502,
      'BFF_UPSTREAM_UNAVAILABLE',
      'Backend request failed before a valid response was received.'
    );
  }
};
