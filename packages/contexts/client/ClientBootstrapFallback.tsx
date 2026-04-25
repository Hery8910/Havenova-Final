'use client';

import styles from './ClientBootstrapFallback.module.css';

type ClientBootstrapFallbackProps = {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  meta?: string;
};

export function ClientBootstrapFallback({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  meta,
}: ClientBootstrapFallbackProps) {
  return (
    <main className={styles.shell} role="main">
      <section className={styles.card} role="alert" aria-live="assertive">
        <p className={styles.eyebrow}>Client Bootstrap Error</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
        <div className={styles.actions}>
          <button className={`${styles.primary} button`} type="button" onClick={onPrimary}>
            {primaryLabel}
          </button>
          {secondaryLabel && onSecondary ? (
            <button className={styles.secondary} type="button" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
