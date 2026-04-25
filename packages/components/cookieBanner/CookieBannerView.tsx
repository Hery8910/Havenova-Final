import type { RefObject } from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './CookieBanner.module.css';

export interface CookieBannerTexts {
  title: string;
  description: string;
  statusLabel: string;
  acceptAll: string;
  rejectAll: string;
  saveSelection: string;
  close: string;
  categoriesTitle: string;
  necessaryTitle: string;
  necessaryDescription: string;
  alwaysOn: string;
  enableStats: string;
  statsDescription: string;
  a11y: {
    dialog: string;
    close: string;
    settings: string;
    necessary: string;
    statistics: string;
  };
}

export interface CookieBannerViewProps {
  texts: CookieBannerTexts;
  isOpen?: boolean;
  dialogRef?: RefObject<HTMLElement | null>;
  titleId: string;
  descriptionId: string;
  settingsId: string;
  stats: boolean;
  onToggleStats: (checked: boolean) => void;
  onSave: () => void;
  onReject: () => void;
  onAccept: () => void;
  onClose: () => void;
}

export function CookieBannerView({
  texts,
  isOpen = true,
  dialogRef,
  titleId,
  descriptionId,
  settingsId,
  stats,
  onToggleStats,
  onSave,
  onReject,
  onAccept,
  onClose,
}: CookieBannerViewProps) {
  return (
    <div className={`${styles.overlay} ${!isOpen ? styles.overlayClosing : ''}`}>
      <section
        ref={dialogRef}
        className={`${styles.card} ${!isOpen ? styles.cardClosing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-roledescription={texts.a11y.dialog}
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={texts.a11y.close}
        >
          <IoClose aria-hidden="true" />
        </button>

        <span className={styles.status}>{texts.statusLabel}</span>

        <div className={styles.media} aria-hidden="true">
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
            <path
              d="M15.75 5.25a2.25 2.25 0 0 0 2.25 2.25h.75A5.25 5.25 0 1 1 13.5 2.25v.75a2.25 2.25 0 0 0 2.25 2.25Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="9.2" r="1" fill="currentColor" />
            <circle cx="8.25" cy="13.75" r="1" fill="currentColor" />
            <circle cx="13.5" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>

        <article className={styles.content}>
          <h4 id={titleId} className={styles.title}>
            {texts.title}
          </h4>
          <p id={descriptionId} className={styles.description}>
            {texts.description}
          </p>
        </article>

        <section className={styles.settings} aria-labelledby={settingsId}>
          <header className={styles.settingsHeader}>
            <h5 id={settingsId} className={styles.settingsTitle}>
              {texts.categoriesTitle}
            </h5>
          </header>

          <div className={styles.optionList}>
            <article className={`${styles.optionCard} ${styles.optionCardLocked}`}>
              <div className={styles.optionContent}>
                <h6 className={styles.optionTitle}>{texts.necessaryTitle}</h6>
                <p className={styles.optionDescription}>{texts.necessaryDescription}</p>
              </div>
              <div className={styles.switchGroup}>
                <span className={styles.lockedBadge}>{texts.alwaysOn}</span>
                <label className={styles.switch} aria-label={texts.a11y.necessary}>
                  <input type="checkbox" checked disabled aria-disabled="true" />
                  <span className={styles.slider} />
                </label>
              </div>
            </article>

            <article className={styles.optionCard}>
              <div className={styles.optionContent}>
                <h6 className={styles.optionTitle}>{texts.enableStats}</h6>
                <p className={styles.optionDescription}>{texts.statsDescription}</p>
              </div>
              <label className={styles.switch} aria-label={texts.a11y.statistics}>
                <input
                  type="checkbox"
                  checked={stats}
                  onChange={(event) => onToggleStats(event.target.checked)}
                  aria-describedby={descriptionId}
                />
                <span className={styles.slider} />
              </label>
            </article>
          </div>
        </section>

        <div
          className={`${styles.actions} ${!isOpen ? styles.actionsClosing : ''}`}
          aria-label={texts.a11y.settings}
        >
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            {texts.close}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={onReject}>
            {texts.rejectAll}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={onSave}>
            {texts.saveSelection}
          </button>
          <button type="button" className={styles.btnPrimary} onClick={onAccept}>
            {texts.acceptAll}
          </button>
        </div>
      </section>
    </div>
  );
}
