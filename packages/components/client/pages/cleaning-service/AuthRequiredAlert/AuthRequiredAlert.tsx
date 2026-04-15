import Link from 'next/link';
import styles from './AuthRequiredAlert.module.css';
import { href } from '../../../../../utils/navigation';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface AuthRequiredAlertTexts {
  title: string;
  description: string;
  closeLabel: string;
  a11y: {
    dialogLabel: string;
    actionsLabel: string;
    loginLabel: string;
    registerLabel: string;
  };
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
    <div className={styles.overlay}>
      <aside
        className={styles.alert}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cleaning-auth-alert-title"
        aria-describedby="cleaning-auth-alert-description"
        aria-label={texts.a11y.dialogLabel}
      >
        <header className={styles.heading}>
          <div className={styles.iconContainer}>
            <div className={styles.imageWrapper}>
              <h2 id="cleaning-auth-alert-title" className={styles.title}>
                {texts.title}
              </h2>
            </div>

            <button
              className={`button_close ${styles.closeButton}`}
              type="button"
              onClick={onClose}
              aria-label={texts.closeLabel}
            >
              <IoClose aria-hidden="true" focusable="false" />
            </button>
          </div>
        </header>
        <article className={styles.content}>
          <p id="cleaning-auth-alert-description" className={styles.description}>
            {texts.description}
          </p>
        </article>
        <nav className={styles.actions} aria-label={texts.a11y.actionsLabel}>
          <Link
            className={styles.loginLink}
            href={href(lang, texts.ctas.login.href)}
            aria-label={texts.a11y.loginLabel}
          >
            {texts.ctas.login.label}
          </Link>
          <Link
            className={styles.registerLink}
            href={href(lang, texts.ctas.register.href)}
            aria-label={texts.a11y.registerLabel}
          >
            {texts.ctas.register.label}
          </Link>
        </nav>
      </aside>
    </div>
  );
}
