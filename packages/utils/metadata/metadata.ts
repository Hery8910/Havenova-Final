// packages/utils/metadata.ts
import { Metadata } from 'next';
import type { Locale } from '@havenova/i18n';
import { pageMetadata } from '@havenova/i18n/metadata';

export function getPageMetadata(lang: Locale, page: string): Metadata {
  const fallbackLang: Locale = 'de';
  return pageMetadata[page]?.[lang] || pageMetadata[page]?.[fallbackLang] || {};
}
