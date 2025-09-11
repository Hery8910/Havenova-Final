'use client';
import styles from './Values.module.css';
import { useI18n } from '../../../contexts/I18nContext';

import Image from 'next/image';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';

export interface ValuesItems {
  label: string;
  description: string;
  image: { src: string; alt: string };
}

export interface ValuesData {
  title: string;
  list: ValuesItems[];
}

const Values: React.FC = () => {
  const { texts } = useI18n();
  const values: ValuesData = texts?.components?.values;
  const { user } = useUser();
  const [theme, setTheme] = useState<string>('light');

  const backgroundImage =
    theme === 'dark'
      ? "url('/images/values-background-dark.png')"
      : "url('/images/values-background-light.png')";

  useEffect(() => {
    if (user?.theme) {
      setTheme(user.theme);
    } else {
      // fallback a localStorage o un valor default
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
    }
  }, [user]);

  if (!values) {
    return (
      <section className={styles.section}>
        <div
          className={styles.skeleton}
          style={{ width: '100%', height: 504, background: '#eee' }}
        />
      </section>
    );
  }

  return (
    <section
      className={styles.section}
      style={{
        backgroundImage,
      }}
    >
      <header className={styles.header}>
        <h2>{values.title}</h2>
      </header>
      <ul className={styles.ul}>
        {values.list.map(
          (
            item: { label: string; description: string; image: { src: string; alt: string } },
            idx: number
          ) => {
            return (
              <li className={styles.li} key={idx}>
                <h2 className={styles.num}>0{idx + 1}.</h2>
                <h2 className={styles.li_h2}>{item.label}</h2>
                <p className={styles.li_p}>{item.description}</p>
              </li>
            );
          }
        )}
      </ul>
    </section>
  );
};

export default Values;
