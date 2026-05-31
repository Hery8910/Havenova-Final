'use client';

import { useI18n } from '../../../../../contexts';
import ThemeToggler from '../../../../themeToggler/ThemeToggler';
import type { PreferencesTexts } from './userPreferencesCard.types';

export function SettingsThemeControl() {
  const { texts } = useI18n();
  const preferenceTexts: PreferencesTexts = texts?.pages?.client?.user?.profile?.preferences;
  const themeTexts = preferenceTexts?.sections?.theme;

  return (
    <ThemeToggler
      display="icon-with-value"
      ariaLabel={themeTexts?.buttonLabel}
      darkLabel={themeTexts?.darkMode}
      lightLabel={themeTexts?.lightMode}
    />
  );
}
