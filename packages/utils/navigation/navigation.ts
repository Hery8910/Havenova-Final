// packages/utils/navigation.ts

/**
 * Genera un href seguro con el idioma actual.
 * @param lang Idioma actual (ej. "de" | "en")
 * @param path Ruta destino (ej. "/about" o "about")
 * @returns Ruta completa con el idioma al inicio
 */
export function href(lang: string, path: string): string {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `/${lang}${path}`;
}
