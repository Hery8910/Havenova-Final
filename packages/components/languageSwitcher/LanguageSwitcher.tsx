'use client';
import styles from './LanguageSwitcher.module.css';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useProfile, useWorker } from '../../contexts';
import Image from 'next/image';

interface LanguageSwitcherProps {
  ariaLabel?: string;
  switchToEnglishLabel?: string;
  switchToGermanLabel?: string;
  englishVisibleLabel?: string;
  germanVisibleLabel?: string;
}

export default function LanguageSwitcher({
  ariaLabel,
  switchToEnglishLabel,
  switchToGermanLabel,
  englishVisibleLabel,
  germanVisibleLabel,
}: LanguageSwitcherProps) {
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
        <button
          type="button"
          className={styles.button}
          onClick={() => switchLang('de')}
          aria-label={switchToGermanLabel ?? ariaLabel ?? 'Switch language to German'}
          title={switchToGermanLabel ?? ariaLabel ?? 'Switch language to German'}
        >
          <Image
            className={styles.logo}
            src="/images/germany.png"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          {germanVisibleLabel ?? 'DE'}
        </button>
      ) : (
        <button
          type="button"
          className={styles.button}
          onClick={() => switchLang('en')}
          aria-label={switchToEnglishLabel ?? ariaLabel ?? 'Switch language to English'}
          title={switchToEnglishLabel ?? ariaLabel ?? 'Switch language to English'}
        >
          <Image
            className={styles.logo}
            src="/images/uk.png"
            alt=""
            width={20}
            height={20}
            aria-hidden="true"
          />
          {englishVisibleLabel ?? 'EN'}
        </button>
      )}
    </section>
  );
}
