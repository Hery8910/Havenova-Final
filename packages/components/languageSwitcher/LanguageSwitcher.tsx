'use client';
import styles from './LanguageSwitcher.module.css';
import { IoLanguage } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useProfile, useWorker } from '../../contexts';
import Image from 'next/image';

export default function LanguageSwitcher() {
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

  const setLanguage = profileContext?.setLanguage ?? workerContext?.setLanguage;
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = pathname.split('/')[1] as 'de' | 'en';

  function switchLang(newLang: 'de' | 'en') {
    if (!setLanguage) return;
    // 1. Guardar cookie
    Cookies.set('lang', newLang, { path: '/', expires: 365 });
    setLanguage(newLang);
    // 2. Cambiar la URL actual
    const parts = pathname.split('/');
    parts[1] = newLang; // reemplaza el slug del idioma
    router.push(parts.join('/'));
  }

  return (
    <section>
      {currentLang === 'en' ? (
        <button className={styles.button} onClick={() => switchLang('de')}>
          <Image
            className={styles.logo}
            src="/images/germany.png"
            alt="Germany Flag icon"
            width={20}
            height={20}
          />
          De
        </button>
      ) : (
        <button className={styles.button} onClick={() => switchLang('en')}>
          <Image
            className={styles.logo}
            src="/images/uk.png"
            alt="Germany Flag icon"
            width={20}
            height={20}
          />
          En
        </button>
      )}
    </section>
  );
}
