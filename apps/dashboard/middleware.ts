// apps/dashboard/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED = ['de', 'en'] as const;
const DEFAULT_LANG = 'de';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignora assets, _next y api
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.[^/]+$/)) {
    return NextResponse.next();
  }

  // Si ya hay idioma en la ruta (ej. /dashboard/de), sigue normal
  if (SUPPORTED.some((lang) => pathname.startsWith(`/${lang}`))) {
    return NextResponse.next();
  }

  // 1) Cookie
  const cookieLang = req.cookies.get('lang')?.value;
  if (cookieLang && SUPPORTED.includes(cookieLang as any)) {
    return NextResponse.redirect(new URL(`/${cookieLang}${pathname}`, req.url));
  }

  // 2) Header Accept-Language
  const header = req.headers.get('accept-language') || '';
  const preferred = header.toLowerCase().startsWith('de') ? 'de' : 'en';

  // 3) Fallback
  const lang = SUPPORTED.includes(preferred as any) ? preferred : DEFAULT_LANG;

  return NextResponse.redirect(new URL(`/${lang}${pathname}`, req.url));
}

// Opcional pero recomendable: asegurar que corre en todas las rutas “públicas”
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
