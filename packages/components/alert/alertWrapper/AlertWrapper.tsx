'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AlertPopup } from '../alertPopup';
import type { AlertMedia, AlertAction } from '../alertPopup/AlertPopup';
import type {
  ActionAlertPayload,
  AlertPayload,
  AlertVisualState,
} from '../../../contexts/alert/useAlert';
import { getAlertType } from '../../../utils/alertType';
import { useI18n } from '../../../contexts/i18n';

type AlertResponse = AlertPayload;

interface AlertWrapperProps {
  response: AlertResponse | null;
  isOpen?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const alertAssetMap: Partial<Record<AlertVisualState, string>> = {
  success: '/alert/success.svg',
  error: '/alert/error.svg',
  warning: '/alert/warning.svg',
  confirm: '/alert/warning.svg',
  info: '/alert/info.svg',
};

const statusLabelMap: Record<AlertVisualState, string> = {
  loading: 'Loading',
  success: 'Success',
  error: 'Error',
  confirm: 'Confirmation',
  warning: 'Warning',
  info: 'Information',
};

function isActionResponse(response: AlertResponse | null): response is ActionAlertPayload {
  return Boolean(response && response.variant !== 'loading');
}

export default function AlertWrapper({
  response,
  isOpen = true,
  onCancel,
  onConfirm,
}: AlertWrapperProps) {
  const { texts } = useI18n();
  const dialogRef = useRef<HTMLElement | null>(null);

  const currentState: AlertVisualState = useMemo(() => {
    if (!response) return 'info';

    return response.variant ?? getAlertType(response.status ?? 200);
  }, [response]);
  const isLoading = currentState === 'loading';
  const actionResponse = isActionResponse(response) ? response : null;

  const hasConfirm = Boolean(actionResponse && onConfirm && actionResponse.confirmLabel);
  const hasCancel = Boolean(actionResponse && onCancel && actionResponse.cancelLabel);
  const isDismissible = hasCancel;

  const dialogLabel = texts.popups?.a11y?.dialog ?? 'Alert dialog';
  const loadingLabel = texts.popups?.a11y?.loading ?? 'Loading message';
  const handleDialogRef = useCallback((node: HTMLElement | null) => {
    dialogRef.current = node;
  }, []);

  useEffect(() => {
    if (!response || isLoading) return;
    dialogRef.current?.focus();
  }, [isLoading, response]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDismissible) {
        onCancel?.();
      }
    },
    [isDismissible, onCancel]
  );

  useEffect(() => {
    if (!response) return;
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [response, handleKeyDown]);

  if (!response) return null;

  const media: AlertMedia =
    currentState === 'loading'
      ? {
          kind: 'spinner',
          label: loadingLabel,
        }
      : {
          kind: 'image',
          src: alertAssetMap[currentState] ?? '/alert/info.svg',
          alt: statusLabelMap[currentState],
        };

  let primaryAction: AlertAction | undefined;
  let secondaryAction: AlertAction | undefined;

  if (hasConfirm && hasCancel) {
    primaryAction = {
      label: actionResponse!.confirmLabel!,
      onAction: onConfirm!,
      tone: currentState === 'confirm' ? 'danger' : 'primary',
    };
    secondaryAction = {
      label: actionResponse!.cancelLabel!,
      onAction: onCancel!,
      tone: 'secondary',
    };
  } else if (hasConfirm) {
    primaryAction = {
      label: actionResponse!.confirmLabel!,
      onAction: onConfirm!,
      tone: currentState === 'confirm' ? 'danger' : 'primary',
    };
  } else if (hasCancel) {
    primaryAction = {
      label: actionResponse!.cancelLabel!,
      onAction: onCancel!,
      tone: 'primary',
    };
  }

  return (
    <AlertPopup
      variant={currentState}
      isOpen={isOpen}
      title={response.title}
      description={response.description}
      media={media}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      onBackdropClick={isDismissible ? onCancel : undefined}
      dialogLabel={dialogLabel}
      dialogRef={handleDialogRef}
    />
  );
}
