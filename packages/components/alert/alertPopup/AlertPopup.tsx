'use client';

import { useId } from 'react';
import styles from './AlertPopup.module.css';
import type { AlertVisualState } from '../../../contexts/alert/useAlert';
import Image from 'next/image';

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

const alertCardClassMap: Record<AlertVisualState, string> = {
  loading: 'bg--alert-loading',
  success: 'bg--alert-success',
  error: 'bg--alert-error',
  confirm: 'bg--alert-confirm',
  warning: 'bg--alert-warning',
  info: 'bg--alert-info',
};

const alertPrimaryButtonClassMap: Record<AlertVisualState, string> = {
  loading: 'button--alert-loading',
  success: 'button--alert-success',
  error: 'button--alert-error',
  confirm: 'button--alert-confirm',
  warning: 'button--alert-warning',
  info: 'button--alert-info',
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

    return (
      <Image
        className={`${styles.image} ${styles[`image--${variant}`] ?? ''}`}
        src={media.src}
        alt={media.alt}
        width={80}
        height={80}
        priority
      />
    );
  };

  const renderAction = (action: AlertAction | undefined, fallbackTone: AlertActionTone) => {
    if (!action) return null;

    const tone = action.tone ?? fallbackTone;
    const toneClass =
      tone === 'secondary'
        ? 'button--outline'
        : tone === 'danger'
          ? 'button--alert-error'
          : alertPrimaryButtonClassMap[variant];

    return (
      <button
        type="button"
        onClick={action.onAction}
        className={`${styles.actionButton} button ${toneClass}`}
      >
        {action.label}
      </button>
    );
  };

  return (
    <div
      className={`${styles.overlay} ${alertCardClassMap[variant]} ${isOpen ? 'app-anim-overlay-enter' : 'app-anim-overlay-exit'}`}
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
        className={`${styles.card} card card--neutral ${layoutClass} ${isOpen ? 'app-anim-modal-enter' : 'app-anim-modal-exit'}`}
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
            {renderAction(primaryAction, 'primary')}
          </div>
        ) : null}
      </section>
    </div>
  );
}
