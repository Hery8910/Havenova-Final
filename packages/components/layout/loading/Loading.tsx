'use client';
import React, { useEffect, useState } from 'react';
import styles from './Loading.module.css';
import Image from 'next/image';
import { useI18n } from '../../../contexts/i18n/I18nContext';
import { useUser } from '../../../contexts/user/UserContext';

export default function Loading() {
  const { user } = useUser();
  const { texts } = useI18n();
  const [theme, setTheme] = useState<string>('light');

  const backgroundImage =
    theme === 'dark'
      ? '/images/logos/logo-vertical-dark.webp'
      : '/images/logos/logo-vertical-light.webp';

  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    } else {
      // fallback a localStorage o un valor default
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
    }
  }, [user]);

  return (
    <main className={styles.loadingContainer}>
      <Image
        src={backgroundImage}
        alt="Havenova Logo"
        width={500}
        height={500}
        className={styles.logo}
      />
      <ul className={styles.ul}>
        <li className={styles.dot} />
        <li className={styles.dot} />
        <li className={styles.dot} />
        <li className={styles.dot} />
      </ul>
    </main>
  );
}
