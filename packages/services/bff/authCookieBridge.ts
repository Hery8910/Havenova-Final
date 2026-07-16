import type { NextResponse } from 'next/server';

const AUTH_COOKIE_NAMES = new Set(['accessToken', 'refreshToken']);

export type ParsedAuthCookie = {
  httpOnly?: boolean;
  maxAge?: number;
  name: string;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
  secure?: boolean;
  value: string;
  expires?: Date;
};

const parseSameSite = (value: string): ParsedAuthCookie['sameSite'] => {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'lax' || normalized === 'strict' || normalized === 'none') {
    return normalized;
  }
  return undefined;
};

const parseSetCookie = (setCookieValue: string): ParsedAuthCookie | null => {
  const parts = setCookieValue
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);

  const [nameValue, ...attributes] = parts;
  if (!nameValue) return null;

  const separatorIndex = nameValue.indexOf('=');
  if (separatorIndex <= 0) return null;

  const name = nameValue.slice(0, separatorIndex).trim();
  const value = nameValue.slice(separatorIndex + 1);

  if (!AUTH_COOKIE_NAMES.has(name)) return null;

  const parsed: ParsedAuthCookie = {
    name,
    value,
  };

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split('=');
    const key = rawKey.trim().toLowerCase();
    const rawValue = rawValueParts.join('=').trim();

    if (key === 'httponly') {
      parsed.httpOnly = true;
      continue;
    }

    if (key === 'secure') {
      parsed.secure = true;
      continue;
    }

    if (key === 'path' && rawValue) {
      parsed.path = rawValue;
      continue;
    }

    if (key === 'samesite' && rawValue) {
      parsed.sameSite = parseSameSite(rawValue);
      continue;
    }

    if (key === 'max-age' && rawValue) {
      const maxAge = Number(rawValue);
      if (Number.isFinite(maxAge)) {
        parsed.maxAge = maxAge;
      }
      continue;
    }

    if (key === 'expires' && rawValue) {
      const expires = new Date(rawValue);
      if (!Number.isNaN(expires.getTime())) {
        parsed.expires = expires;
      }
    }
  }

  return parsed;
};

export const readAuthCookiesFromBackendResponse = (
  backendResponse: Response
): ParsedAuthCookie[] => {
  const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
  return setCookies.map(parseSetCookie).filter((value): value is ParsedAuthCookie => Boolean(value));
};

export const applyAuthCookiesFromBackend = (
  backendResponse: Response,
  response: NextResponse
) => {
  for (const parsed of readAuthCookiesFromBackendResponse(backendResponse)) {
    response.cookies.set({
      name: parsed.name,
      value: parsed.value,
      httpOnly: parsed.httpOnly,
      secure: parsed.secure,
      sameSite: parsed.sameSite,
      path: parsed.path || '/',
      maxAge: parsed.maxAge,
      expires: parsed.expires,
    });
  }
};
