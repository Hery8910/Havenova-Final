'use client';
import { useEffect } from 'react';
import { useProfile } from '../../contexts/profile/ProfileContext';
import styles from './ThemeToggler.module.css';
import Image from 'next/image';

const ThemeToggler = () => {
  const { profile, setTheme } = useProfile();

  const theme: 'dark' | 'light' = profile?.theme || 'light';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <button
      className={`${styles.toggleButton} ${theme === 'dark' ? styles.dark : ''}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className={styles.iconsWrapper}>
        <span className={styles.moon}>
          <Image
            className={styles.logo}
            src="/svg/moon.svg"
            alt="Moon icon"
            width={30}
            height={30}
          />
        </span>
        <span className={styles.sun}>
          <Image className={styles.logo} src="/svg/sun.svg" alt="Sun icon" width={30} height={30} />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggler;
