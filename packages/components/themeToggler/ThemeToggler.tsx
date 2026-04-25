'use client';

import { useEffect } from 'react';
import { LuMoon, LuSunMedium } from 'react-icons/lu';
import { useOptionalProfileContext } from '../../contexts/profile/ProfileContext';
import { useOptionalWorkerContext } from '../../contexts/worker/WorkerContext';
import sharedStyles from '../client/navbar/NavbarShared.module.css';
import styles from './ThemeToggler.module.css';
import { IoMoonOutline } from 'react-icons/io5';
import type { ResolvedNavbarThemeToggle } from '../client/navbar/navbar.shared';
import type { ThemeMode } from '../../types';

interface ThemeTogglerProps {
  display?: 'icon' | 'icon-with-value';
  labels?: ResolvedNavbarThemeToggle;
  ariaLabel?: string;
  darkLabel?: string;
  lightLabel?: string;
}

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
};

const getDocumentTheme = (): ThemeMode | null => {
  if (typeof document === 'undefined') return null;
  const theme = document.documentElement.getAttribute('data-theme');
  return theme === 'dark' || theme === 'light' ? theme : null;
};

const ThemeToggler = ({
  display = 'icon',
  labels,
  ariaLabel,
  darkLabel,
  lightLabel,
}: ThemeTogglerProps) => {
  const profileContext = useOptionalProfileContext();
  const workerContext = useOptionalWorkerContext();

  const setTheme = profileContext?.setTheme ?? workerContext?.setTheme;
  const theme =
    profileContext?.profile?.theme ??
    workerContext?.worker?.theme ??
    getStoredTheme() ??
    getDocumentTheme() ??
    'light';
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const currentThemeLabel =
    theme === 'dark'
      ? (darkLabel ?? labels?.darkMode ?? 'Dark mode')
      : (lightLabel ?? labels?.lightMode ?? 'Light mode');
  const nextThemeLabel =
    nextTheme === 'dark'
      ? (darkLabel ?? labels?.darkMode ?? 'Dark mode')
      : (lightLabel ?? labels?.lightMode ?? 'Light mode');
  const buttonTitle = labels?.buttonLabel ?? 'Theme';
  const resolvedAriaLabel =
    ariaLabel ?? `${buttonTitle}: ${currentThemeLabel}. Switch to ${nextThemeLabel}`;
  const shouldShowCurrentValue = display === 'icon-with-value';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (!setTheme) return;
    void setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={`${sharedStyles.iconButton} ${styles.toggleButton} ${
        shouldShowCurrentValue ? styles.toggleButtonWithValue : ''
      } ${
        theme === 'dark' ? `${sharedStyles.iconButtonActive} ${styles.isDark}` : styles.isLight
      }`}
      onClick={toggleTheme}
      aria-label={resolvedAriaLabel}
      title={resolvedAriaLabel}
      aria-pressed={theme === 'dark'}
    >
      <span className={styles.iconViewport} aria-hidden>
        <span className={`${styles.iconSlot} ${styles.sunSlot}`}>
          <LuSunMedium className={styles.icon} />
        </span>
        <span className={`${styles.iconSlot} ${styles.moonSlot}`}>
          <IoMoonOutline className={styles.icon} />
        </span>
      </span>
      {shouldShowCurrentValue ? <span className={styles.currentValue}>{currentThemeLabel}</span> : null}
    </button>
  );
};

export default ThemeToggler;
