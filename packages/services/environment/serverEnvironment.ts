import { normalizeEnvironmentValue, resolveEnvironmentMode } from './runtimeMode';

export type ServerEnvironmentInput = {
  backendApiUrl?: string;
  legacyApiBaseUrl?: string;
  legacyApiUrl?: string;
  nodeEnv?: string;
};

const toServerEnvironmentError = (variable: string, reason: string): Error =>
  new Error(`Invalid environment configuration: ${variable} ${reason}.`);

const normalizeBackendApiUrl = (value: string): string => {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw toServerEnvironmentError('BACKEND_API_URL', 'must be an absolute HTTP(S) URL');
  }

  if (
    (url.protocol !== 'http:' && url.protocol !== 'https:') ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw toServerEnvironmentError('BACKEND_API_URL', 'must be a base HTTP(S) URL without a path');
  }

  return url.origin;
};

export const resolveBackendApiUrl = (input: ServerEnvironmentInput): string | undefined => {
  const configuredUrl =
    normalizeEnvironmentValue(input.backendApiUrl) ||
    normalizeEnvironmentValue(input.legacyApiUrl) ||
    normalizeEnvironmentValue(input.legacyApiBaseUrl);

  if (!configuredUrl) {
    if (resolveEnvironmentMode(input.nodeEnv) === 'production') {
      throw toServerEnvironmentError('BACKEND_API_URL', 'is required in production');
    }

    return undefined;
  }

  return normalizeBackendApiUrl(configuredUrl);
};
