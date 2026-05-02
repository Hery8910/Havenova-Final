'use client';

import { usePathname } from 'next/navigation';

/**
 * Hook que devuelve el idioma actual a partir del pathname.
 * Soporta URLs del tipo "/de/...", "/en/..." o "/es/...".
 */
export function useLang(): 'de' | 'en' | 'es' {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  if (lang === 'en' || lang === 'de' || lang === 'es') {
    return lang;
  }
  return 'de';
}
