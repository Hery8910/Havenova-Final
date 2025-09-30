'use client';

import { usePathname } from 'next/navigation';

/**
 * Hook que devuelve el idioma actual a partir del pathname.
 * Soporta URLs del tipo "/de/..." o "/en/...".
 */
export function useLang(): 'de' | 'en' {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  if (lang === 'en' || lang === 'de') {
    return lang;
  }
  return 'de';
}
