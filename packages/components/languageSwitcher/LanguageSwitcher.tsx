'use client';
import styles from './LanguageSwitcher.module.css';
import { IoLanguage } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = pathname.split('/')[1] as 'de' | 'en';

  function switchLang(newLang: 'de' | 'en') {
    // 1. Guardar cookie
    Cookies.set('lang', newLang, { path: '/', expires: 365 });

    // 2. Cambiar la URL actual
    const parts = pathname.split('/');
    parts[1] = newLang; // reemplaza el slug del idioma
    router.push(parts.join('/'));
  }

  return (
    <section>
      {currentLang === 'en' ? (
        <button className={styles.button} onClick={() => switchLang('de')}>
          <IoLanguage /> De
        </button>
      ) : (
        <button className={styles.button} onClick={() => switchLang('en')}>
          <IoLanguage /> En
        </button>
      )}
    </section>
  );
}
