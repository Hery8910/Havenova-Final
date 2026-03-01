import Link from 'next/link';
import styles from './AuthRequiredAlert.module.css';
import { href } from '../../../../../utils/navigation';

interface AuthRequiredAlertTexts {
  title: string;
  description: string;
  closeLabel: string;
  ctas: {
    login: { label: string; href: string };
    register: { label: string; href: string };
  };
}

export default function AuthRequiredAlert({
  texts,
  lang,
  onClose,
}: {
  texts: AuthRequiredAlertTexts;
  lang: 'de' | 'en';
  onClose: () => void;
}) {
  return (
    <aside
      className={styles.alert}
      role="region"
      aria-live="polite"
      aria-labelledby="cleaning-auth-alert-title"
      aria-describedby="cleaning-auth-alert-description"
    >
      <button
        className={`button_close ${styles.closeButton}`}
        type="button"
        onClick={onClose}
        aria-label={texts.closeLabel}
      >
        ×
      </button>

      <h2 id="cleaning-auth-alert-title" className={styles.title}>
        {texts.title}
      </h2>
      <p id="cleaning-auth-alert-description" className={styles.description}>
        {texts.description}
      </p>

      <div className={styles.actions}>
        <Link className={styles.loginLink} href={href(lang, texts.ctas.login.href)}>
          {texts.ctas.login.label}
        </Link>
        <Link className={styles.registerLink} href={href(lang, texts.ctas.register.href)}>
          {texts.ctas.register.label}
        </Link>
      </div>
    </aside>
  );
}
