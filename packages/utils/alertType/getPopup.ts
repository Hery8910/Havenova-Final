import { PopupsTexts, PopupText, PopupCode } from '../../contexts/alert/alert.types';

interface PopupResult {
  title: string;
  description: string;
  close?: string;
  confirm?: string;
}

export function getPopup(
  popups: PopupsTexts,
  code: string | undefined,
  defaultKey: PopupCode,
  hardcodedFallback: PopupResult
): PopupResult {
  const base = popups[defaultKey]; // fallback contextual
  const raw = code ? (popups as any)[code] : undefined;

  const title = typeof raw?.title === 'string' ? raw.title : base?.title || hardcodedFallback.title;

  const description =
    typeof raw?.description === 'string'
      ? raw.description
      : base?.description || hardcodedFallback.description;

  const close =
    typeof raw?.close === 'string' ? raw.close : popups.button?.close || hardcodedFallback.close;

  return { title, description, close };
}
