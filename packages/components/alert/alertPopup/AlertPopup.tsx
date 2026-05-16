'use client';

import { useId } from 'react';
import styles from './AlertPopup.module.css';
import type { AlertVisualState } from '../../../contexts/alert/useAlert';

export type AlertMedia =
  | {
      kind: 'spinner';
      label: string;
    }
  | {
      kind: 'image';
      src: string;
      alt: string;
    };

export type AlertActionTone = 'primary' | 'secondary' | 'danger';

export interface AlertAction {
  label: string;
  onAction: () => void;
  tone?: AlertActionTone;
}

export interface AlertPopupProps {
  variant: AlertVisualState;
  isOpen?: boolean;
  title: string;
  description: string;
  media: AlertMedia;
  primaryAction?: AlertAction;
  secondaryAction?: AlertAction;
  onBackdropClick?: () => void;
  dialogLabel?: string;
  dialogRef?: (node: HTMLElement | null) => void;
}

const toneClassMap: Record<AlertActionTone, string> = {
  primary: 'button--primary',
  secondary: 'button--outline',
  danger: 'button--secondary',
};

export default function AlertPopup({
  variant,
  isOpen = true,
  title,
  description,
  media,
  primaryAction,
  secondaryAction,
  onBackdropClick,
  dialogLabel,
  dialogRef,
}: AlertPopupProps) {
  const titleId = useId();
  const descriptionId = useId();
  const actionsCount = Number(Boolean(primaryAction)) + Number(Boolean(secondaryAction));
  const dialogRole = media.kind === 'spinner' ? 'dialog' : 'alertdialog';
  const layoutClass =
    actionsCount === 0
      ? styles.layoutMessage
      : actionsCount === 1
        ? styles.layoutSingle
        : styles.layoutDouble;

  const renderMedia = () => {
    if (media.kind === 'spinner') {
      return (
        <div className={styles.spinnerWrap} role="status" aria-label={media.label}>
          <span className={styles.spinnerOrbit} aria-hidden="true" />
          <span className={`${styles.spinnerCore} app-anim-spin`} aria-hidden="true" />
        </div>
      );
    }

    return <img className={styles.image} src={media.src} alt={media.alt} />;
  };

  const renderAction = (action: AlertAction | undefined, fallbackTone: AlertActionTone) => {
    if (!action) return null;

    const tone = action.tone ?? fallbackTone;

    return (
      <button
        type="button"
        onClick={action.onAction}
        className={`${styles.actionButton} button ${toneClassMap[tone]}`}
      >
        {action.label}
      </button>
    );
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? 'app-anim-overlay-enter' : 'app-anim-overlay-exit'}`}
      onClick={onBackdropClick}
    >
      <section
        ref={dialogRef}
        role={dialogRole}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-label={dialogLabel}
        aria-busy={media.kind === 'spinner'}
        tabIndex={-1}
        className={`${styles.card} card card--primary ${styles[`card--${variant}`] ?? ''} ${layoutClass} ${isOpen ? 'app-anim-modal-enter' : 'app-anim-modal-exit'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.media}>{renderMedia()}</div>

        <div className={styles.content}>
          <h4 id={titleId} className={styles.title}>
            {title}
          </h4>
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        </div>

        {actionsCount > 0 ? (
          <div className={styles.actions}>
            {renderAction(secondaryAction, 'secondary')}
            {renderAction(primaryAction, variant === 'confirm' ? 'danger' : 'primary')}
          </div>
        ) : null}
      </section>
    </div>
  );
}
