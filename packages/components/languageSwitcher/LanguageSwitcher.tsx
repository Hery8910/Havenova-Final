import { useUser } from '../../contexts/user/UserContext';
import { useI18n } from '../../contexts/i18n/I18nContext';
import styles from './LanguageSwitcher.module.css';
import { IoLanguage } from 'react-icons/io5';

export default function LanguageSwitcher() {
  const { setLanguage, language } = useI18n();
  const { updateUserLanguage, user } = useUser();

  const handleChange = async (lang: string) => {
    setLanguage(lang);
    await updateUserLanguage(lang);
  };

  return (
    <nav>
      {language === 'en' ? (
        <button className={styles.button} onClick={() => handleChange('de')}>
          <IoLanguage /> <p>De</p>
        </button>
      ) : (
        <button className={styles.button} onClick={() => handleChange('en')}>
          <IoLanguage /> <p>En</p>
        </button>
      )}
    </nav>
  );
}
