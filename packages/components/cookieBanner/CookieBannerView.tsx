import type { RefObject } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './CookieBanner.module.css';

export interface CookieBannerTexts {
  title: string;
  description: string;
  close: string;
  a11y: {
    close: string;
  };
}

export interface CookieBannerViewProps {
  texts: CookieBannerTexts;
  isOpen?: boolean;
  dialogRef?: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  onAcknowledge: () => void;
}

export function CookieBannerView({
  texts,
  isOpen = true,
  dialogRef,
  titleId,
  descriptionId,
  onAcknowledge,
}: CookieBannerViewProps) {
  return (
    <div
      className={`${styles.overlay} ${isOpen ? 'app-anim-overlay-enter' : 'app-anim-overlay-exit'}`}
    >
      <aside
        ref={dialogRef}
        className={styles.banner}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <div className={`${styles.surface} card card--secondary`}>
          <header className={styles.heading}>
            <div className={styles.iconContainer}>
              <div className={styles.imageWrapper}>
                <h2 id={titleId} className={styles.title}>
                  {texts.title}
                </h2>
              </div>

              <button
                type="button"
                className={`button button--close ${styles.closeButton}`}
                onClick={onAcknowledge}
                aria-label={texts.a11y.close}
              >
                <IoClose aria-hidden="true" focusable="false" />
              </button>
            </div>
          </header>

          <article className={styles.content}>
            <p id={descriptionId} className={styles.description}>
              {texts.description}
            </p>
          </article>

          <nav className={styles.actions} aria-label={texts.title}>
            <button
              type="button"
              className={`${styles.link} button button--secondary`}
              onClick={onAcknowledge}
            >
              {texts.close}
            </button>
          </nav>
        </div>
      </aside>
    </div>
  );
}
