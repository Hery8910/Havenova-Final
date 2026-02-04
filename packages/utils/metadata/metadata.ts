// packages/utils/metadata.ts
import { Metadata } from 'next';
import { pageMetadata } from '@havenova/i18n/metadata';

export function getPageMetadata(lang: 'de' | 'en', page: string): Metadata {
  const fallbackLang = 'de';
  return pageMetadata[page]?.[lang] || pageMetadata[page]?.[fallbackLang] || {};
}
