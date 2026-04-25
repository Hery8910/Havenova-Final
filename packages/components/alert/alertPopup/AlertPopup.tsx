'use client';
import { useEffect, useId, useRef } from 'react';
import styles from './AlertPopup.module.css';
import { useI18n } from '../../../contexts/i18n';
import { AlertType } from '../../../utils/alertType';
import { IoClose } from 'react-icons/io5';
import type { AlertVisualState } from '../../../contexts/alert/useAlert';

export interface AlertPopupProps {
  type: AlertType;
  variant?: AlertVisualState;
  isOpen?: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function AlertPopup({
  type,
  variant,
  isOpen = true,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
}: AlertPopupProps) {
  const { texts } = useI18n();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const currentState: AlertVisualState = loading
    ? 'loading'
    : variant ?? (type === 'warning' ? 'warning' : type === 'error' ? 'error' : type);
  const hasConfirm = !loading && !!onConfirm && !!confirmLabel;
  const hasCancel = !loading && !!onCancel && !!cancelLabel;
  const hasActions = hasConfirm || hasCancel;
  const isConfirm = currentState === 'confirm';
  const statusLabelMap: Record<AlertVisualState, string> = {
    loading: 'Loading',
    success: 'Success',
    error: 'Error',
    confirm: 'Confirm',
    warning: 'Warning',
    info: 'Info',
  };

  const closeLabel = texts.popups?.a11y?.close ?? 'Close popup';
  const dialogLabel = texts.popups?.a11y?.dialog ?? 'Alert dialog';
  const loadingLabel = texts.popups?.a11y?.loading ?? 'Loading message';

  useEffect(() => {
    if (!loading) {
      dialogRef.current?.focus();
    }
  }, [loading]);

  const handleOverlayClick = () => {
    if (hasCancel) onCancel?.();
  };

  const renderMedia = () => {
    if (loading) {
      return <span className={styles.spinner} aria-hidden="true" />;
    }

    if (isConfirm) {
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 6v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
          <path
            d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25S7.44 20.25 12 20.25 20.25 16.56 20.25 12 16.56 3.75 12 3.75Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    }

    if (currentState === 'success') {
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 7 10.75 16.25 6 11.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (currentState === 'info') {
      return (
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 10.25v5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
          <path
            d="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25S7.44 20.25 12 20.25 20.25 16.56 20.25 12 16.56 3.75 12 3.75Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      );
    }

    return (
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
        <path
          d="M10.4 3.9 3.82 15.3a2 2 0 0 0 1.73 3h13.1a2 2 0 0 0 1.73-3L13.6 3.9a2 2 0 0 0-3.2 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      className={`${styles.overlay} ${!isOpen ? styles.overlayClosing : ''}`}
      onClick={handleOverlayClick}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-roledescription={dialogLabel}
        aria-busy={loading}
        tabIndex={-1}
        className={`${styles.card} ${styles[`card--${currentState}`] ?? ''} ${!isOpen ? styles.cardClosing : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        {hasCancel && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            aria-label={closeLabel}
          >
            <IoClose aria-hidden="true" />
          </button>
        )}
        <span className={styles.status}>{statusLabelMap[currentState]}</span>
        <div
          className={styles.media}
          role={loading ? 'status' : undefined}
          aria-label={loading ? loadingLabel : undefined}
        >
          {renderMedia()}
        </div>
        <article className={styles.content}>
          <h4 id={titleId} className={styles.title}>
            {title}
          </h4>
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        </article>
        {!loading && hasActions && (
          <div className={`${styles.actions} ${!isOpen ? styles.actionsClosing : ''}`}>
            {hasCancel && (
              <button type="button" onClick={onCancel} className={styles.btnSecondary}>
                {cancelLabel}
              </button>
            )}
            {hasConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className={isConfirm ? styles.btnDanger : styles.btnPrimary}
              >
                {confirmLabel}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
