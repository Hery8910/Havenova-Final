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
      <section
        ref={dialogRef}
        className={`glass-panel--base ${styles.card} ${isOpen ? 'app-anim-modal-enter' : 'app-anim-modal-exit'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="button-close"
          onClick={onAcknowledge}
          aria-label={texts.a11y.close}
        >
          <IoClose aria-hidden="true" />
        </button>
        <div className={styles.content}>
          <h2 id={titleId} className={styles.title}>
            {texts.title}
          </h2>
          <p id={descriptionId} className={styles.description}>
            {texts.description}
          </p>
        </div>
        <footer className={styles.actions}>
          <button type="button" className="button" onClick={onAcknowledge}>
            {texts.close}
          </button>
        </footer>
      </section>
    </div>
  );
}
