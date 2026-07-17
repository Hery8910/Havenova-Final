import type { ThemeMode } from '../../types';

const THEME_STORAGE_KEY = 'theme';

export function normalizeTheme(value: unknown): ThemeMode | null {
  return value === 'light' || value === 'dark' ? value : null;
}

export function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;

  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function readSessionStorageValue(key: string): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSessionStorageValue(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeSessionStorageValue(key: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function synchronizeDocumentTheme(theme: ThemeMode) {
  if (typeof document !== 'undefined') {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      // Theme state and remote updates remain valid if a non-browser document rejects mutation.
    }
  }

  writeSessionStorageValue(THEME_STORAGE_KEY, theme);
}
