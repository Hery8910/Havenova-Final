'use client';
import Image from 'next/image';
import styles from './AlertPopup.module.css';
import { AlertType } from '../../../utils/alertType';

export interface AlertPopupProps {
  type: AlertType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean; // 👈 nuevo
}

export default function AlertPopup({
  type,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
}: AlertPopupProps) {
  const imageMap = {
    success: '/svg/alert/success.svg',
    error: '/svg/alert/error.svg',
    warning: '/svg/alert/warning.svg',
    info: '/svg/alert/info.svg',
  };

  const colorMap = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  const bgMap = {
    success: 'var(--bg-success)',
    error: 'var(--bg-error)',
    warning: 'var(--bg-warning)',
    info: 'var(--bg-info)',
  };

  const glowColor = colorMap[type];

  const hasConfirm = !loading && !!onConfirm && !!confirmLabel;

  return (
    <section
      role={hasConfirm ? 'dialog' : 'alertdialog'}
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-description"
      tabIndex={-1}
      className={styles.section}
    >
      <div
        className={styles.modal}
        style={{ borderColor: glowColor, backgroundColor: bgMap[type] }}
      >
        <div className={styles.iconContainer}>
          {loading ? (
            <div className={styles.spinner} />
          ) : (
            <Image
              src={imageMap[type]}
              alt={`${type} icon`}
              width={90}
              height={90}
              className={styles.icon}
              style={{ boxShadow: `0 0 12px ${glowColor}` }}
            />
          )}
        </div>

        <article className={styles.textBlock}>
          <h4 id="alert-title" style={{ color: glowColor }}>
            <strong>{title}</strong>
          </h4>
          <p id="alert-description">{description}</p>

          {!loading && (
            <div className={styles.buttonGroup}>
              <button
                className={styles.cancel}
                onClick={onCancel}
                style={{ borderColor: glowColor, color: glowColor }}
              >
                {cancelLabel || 'Cancelar'}
              </button>

              {hasConfirm && (
                <button
                  className={styles.confirm}
                  onClick={onConfirm}
                  style={{
                    backgroundColor: glowColor,
                    borderColor: glowColor,
                  }}
                >
                  {confirmLabel}
                </button>
              )}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
