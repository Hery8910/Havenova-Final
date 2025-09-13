import { IoIosClose } from 'react-icons/io';
import styles from './CookieBanner.module.css';

export interface CookieBannerTexts {
  title: string;
  description: string;
  acceptAll: string;
  rejectAll: string;
  save: string;
  close: string;
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

export function CookieBannerView({
  texts,
  stats,
  onToggleStats,
  onSave,
  onReject,
  onAccept,
  onClose,
}: CookieBannerViewProps) {
  return (
    <main className={`${styles.wrapper} card`}>
      <section
        className={`${styles.banner} card`}
        role="dialog"
        aria-live="polite"
        aria-label="Cookie consent banner"
        aria-modal="true"
      >
        <article className={styles.article}>
          <h3 className={styles.title}>{texts.title}</h3>
          <p className={styles.description}>{texts.description}</p>

          <aside className={styles.controls}>
            <div className={styles.switch_div}>
              <label className={styles.label} htmlFor="cookie-stats">
                {texts.enableStats}
              </label>
              <label className={styles.switch}>
                <input
                  id="cookie-stats"
                  type="checkbox"
                  checked={stats}
                  onChange={(e) => onToggleStats(e.target.checked)}
                  aria-label={texts.enableStats}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.div}>
              <button className="button_invert" onClick={onSave} aria-label={texts.save}>
                {texts.save}
              </button>
              <button className="button_invert" onClick={onReject} aria-label={texts.rejectAll}>
                {texts.rejectAll}
              </button>
              <button className="button" onClick={onAccept} aria-label={texts.acceptAll}>
                {texts.acceptAll}
              </button>
            </div>
          </aside>
        </article>

        <button className="button_close" onClick={onClose} aria-label={texts.close}>
          <IoIosClose />
        </button>
      </section>
    </main>
  );
}
