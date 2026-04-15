'use client';
import { useEffect } from 'react';
import { useProfile, useWorker } from '../../contexts';
import styles from './ThemeToggler.module.css';
import Image from 'next/image';

interface ThemeTogglerProps {
  ariaLabel?: string;
  darkLabel?: string;
  lightLabel?: string;
}

const ThemeToggler = ({ ariaLabel, darkLabel, lightLabel }: ThemeTogglerProps) => {
  let profileContext: ReturnType<typeof useProfile> | null = null;
  let workerContext: ReturnType<typeof useWorker> | null = null;

  try {
    profileContext = useProfile();
  } catch {
    // ProfileContext not available, fall back to worker.
  }

  if (!profileContext) {
    try {
      workerContext = useWorker();
    } catch {
      // WorkerContext not available.
    }
  }

  const setTheme = profileContext?.setTheme ?? workerContext?.setTheme;

  const theme: 'dark' | 'light' =
    profileContext?.profile?.theme || workerContext?.worker?.theme || 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (!setTheme) return;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${theme === 'dark' ? styles.dark : ''}`}
      onClick={toggleTheme}
      aria-label={
        ariaLabel ??
        (theme === 'dark'
          ? `Switch to ${lightLabel ?? 'light mode'}`
          : `Switch to ${darkLabel ?? 'dark mode'}`)
      }
      title={theme === 'dark' ? lightLabel ?? 'Light mode' : darkLabel ?? 'Dark mode'}
      aria-pressed={theme === 'dark'}
    >
      <div className={styles.iconsWrapper}>
        <span className={styles.moon}>
          <Image
            className={styles.logo}
            src="/svg/moon.svg"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
        </span>
        <span className={styles.sun}>
          <Image className={styles.logo} src="/svg/sun.svg" alt="" width={20} height={20} aria-hidden="true" />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggler;
