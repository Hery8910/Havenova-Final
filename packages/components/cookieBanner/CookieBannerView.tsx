import { IoIosClose } from 'react-icons/io';
import styles from './CookieBanner.module.css';

export interface CookieBannerTexts {
  title: string;
  acceptAll: string;
  rejectAll: string;
  close: string;
  description: string;
  enableStats: string;
}

export interface CookieBannerViewProps {
  texts: CookieBannerTexts;
  stats: boolean;
  onToggleStats: (checked: boolean) => void;
  onSave: () => void;
  onReject: () => void;
  onAccept: () => void;
  onClose: () => void;
}

export function CookieBannerView({ texts, onReject, onAccept, onClose }: CookieBannerViewProps) {
  return (
    <div className={`${styles.wrapper} card`}>
      <section
        className={`${styles.banner} card--glass`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent banner"
        aria-modal="true"
      >
        <article className={styles.article}>
          <h4 className={styles.title}>{texts.title}</h4>
          <p className={styles.description}>{texts.description}</p>
        </article>
        <button className="button" onClick={onReject}>
          {texts.close}
        </button>
      </section>
    </div>
  );
}
