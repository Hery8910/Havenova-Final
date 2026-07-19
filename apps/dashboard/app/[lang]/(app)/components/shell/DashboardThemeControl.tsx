'use client';

import { LuMoon, LuSunMedium } from 'react-icons/lu';

import type { ThemeMode } from '../../../../../../../packages/types';
import styles from './DashboardThemeControl.module.css';

type DashboardThemeControlLabels = {
  theme: string;
  lightMode: string;
  darkMode: string;
  switchToLight: string;
  switchToDark: string;
};

type DashboardThemeControlProps = {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  labels: DashboardThemeControlLabels;
};

export function DashboardThemeControl({
  theme,
  onThemeChange,
  labels,
}: DashboardThemeControlProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const currentThemeLabel = theme === 'dark' ? labels.darkMode : labels.lightMode;
  const nextThemeLabel = nextTheme === 'dark' ? labels.switchToDark : labels.switchToLight;
  const accessibleLabel = `${labels.theme}: ${currentThemeLabel}. ${nextThemeLabel}`;

  return (
    <button
      type="button"
      className={styles.control}
      aria-label={accessibleLabel}
      aria-pressed={theme === 'dark'}
      title={accessibleLabel}
      onClick={() => onThemeChange(nextTheme)}
    >
      <span className={styles.icon} aria-hidden="true">
        {theme === 'dark' ? <LuMoon /> : <LuSunMedium />}
      </span>
      <span className={styles.copy}>{currentThemeLabel}</span>
    </button>
  );
}
