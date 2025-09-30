'use client';
import { useEffect } from 'react';
import { useClient } from '../../contexts/client/ClientContext';
import { applyBrandingToDOM } from '../../utils/applyBrandingToDOM/applyBrandingToDOM';
import styles from './ThemeToggler.module.css';
import { useUser } from '../../contexts/user/UserContext';
import Image from 'next/image';

const ThemeToggler = () => {
  const { user, updateUserTheme } = useUser();
  const { client } = useClient();

  // Usar el theme global del usuario, no local
  const theme: 'dark' | 'light' = user?.theme || 'light';

  useEffect(() => {
    // Cada vez que cambia el theme, actualiza el DOM y branding
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (client?.branding?.[theme]) {
      applyBrandingToDOM(client.branding[theme], client.typography);
    }
  }, [theme, client?.branding, client?.typography]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    updateUserTheme(newTheme as 'light' | 'dark');
    // NO SETEES el useState local ni el DOM aquí, eso se hará en el useEffect de arriba al actualizar el contexto
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
