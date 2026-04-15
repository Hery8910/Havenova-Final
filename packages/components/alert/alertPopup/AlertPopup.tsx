'use client';
import { useEffect, useId, useRef } from 'react';
import Image from 'next/image';
import styles from './AlertPopup.module.css';
import { useI18n } from '../../../contexts/i18n';
import { AlertType } from '../../../utils/alertType';
import { IoClose } from 'react-icons/io5';

export interface AlertPopupProps {
  type: AlertType;
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

  const imageMap: Record<string, string> = {
    success: '/alert/success.svg',
    error: '/alert/error.svg',
    warning: '/alert/warning.svg',
    info: '/alert/info.svg',
  };

  const currentType = loading ? 'loading' : type;
  const hasConfirm = !loading && !!onConfirm && !!confirmLabel;
  const hasCancel = !loading && !!onCancel && !!cancelLabel;
  const primaryAction = hasConfirm
    ? {
        label: confirmLabel,
        onClick: onConfirm,
        className: styles.btnConfirm,
      }
    : hasCancel
      ? {
          label: cancelLabel,
          onClick: onCancel,
          className: styles.btnCancel,
        }
      : null;

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

  return (
    <div className={`${styles.overlay} card`} onClick={handleOverlayClick}>
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-roledescription={dialogLabel}
        aria-busy={loading}
        tabIndex={-1}
        className={styles.card}
        data-type={currentType}
        onClick={(event) => event.stopPropagation()}
      >
        {hasCancel && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            aria-label={closeLabel}
          >
            <span aria-hidden="true">
              <IoClose />
            </span>
          </button>
        )}
        <aside className={styles.aside}>
          <div
            className={loading ? styles.loadingWrapper : styles.iconWrapper}
            role={loading ? 'status' : undefined}
            aria-label={loading ? loadingLabel : undefined}
          >
            {loading ? (
              <svg className={styles.spinner} viewBox="0 0 50 50" aria-hidden="true">
                <circle
                  className={styles.spinnerTrack}
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="6"
                />
                <circle
                  className={styles.spinnerArc}
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="6"
                ></circle>
              </svg>
            ) : (
              <Image
                src={imageMap[type]}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className={styles.iconImage}
              />
            )}
          </div>

          <article className={styles.content}>
            <h4 id={titleId} className={styles.title}>
              {title}
            </h4>
            <p id={descriptionId} className={styles.description}>
              {description}
            </p>
          </article>
        </aside>
        {!loading && primaryAction && (
          <div className={styles.actions}>
            <button
              type="button"
              onClick={primaryAction.onClick}
              className={primaryAction.className}
            >
              {primaryAction.label}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
