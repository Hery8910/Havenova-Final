'use client';
import { useState, useCallback } from 'react';
import type { AlertPopupProps } from '@havenova/components/alert/alertPopup/AlertPopup';

export type AlertVisualState = 'loading' | 'error' | 'success' | 'confirm' | 'warning' | 'info';

export type AlertPayload = Omit<AlertPopupProps, 'type' | 'onConfirm' | 'onCancel'> & {
  status: number;
  variant?: AlertVisualState;
};

export interface AlertConfig {
  response: AlertPayload;
  onCancel: () => void;
  onConfirm?: () => void;
}

type ShowBaseArgs = {
  response: AlertPayload;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ShowConfirmArgs = {
  response: AlertPayload & { confirmLabel: string; cancelLabel?: string };
  onConfirm: () => void;
  onCancel?: () => void;
};

type ShowLoadingArgs = {
  response: AlertPayload;
};

type AlertHookReturn = {
  alert: AlertConfig | null;
  showError: (args: ShowBaseArgs) => void;
  showSuccess: (args: ShowBaseArgs) => void;
  showConfirm: (args: ShowConfirmArgs) => void;
  showLoading: (args: ShowLoadingArgs) => void;
  closeAlert: () => void;
};

export function useAlertBase(): AlertHookReturn {
  const [alert, setAlert] = useState<AlertConfig | null>(null);

  const closeAlert = useCallback(() => setAlert(null), []);

  const showLoading = useCallback(({ response }: ShowLoadingArgs) => {
    setAlert({
      response: {
        status: response.status ?? 102,
        title: response.title,
        description: response.description,
        loading: true,
        variant: 'loading',
        cancelLabel: '',
      },
      onCancel: () => {}, // loading nunca se cancela
    });
  }, []);

  const showError = useCallback(
    ({ response, onCancel, onConfirm }: ShowBaseArgs) => {
      setAlert({
        response: {
          ...response,
          status: response.status ?? 400,
          variant: response.variant ?? 'error',
          cancelLabel: response.cancelLabel ?? 'Close',
        },
        onCancel: onCancel ?? closeAlert,
        onConfirm,
      });
    },
    [closeAlert]
  );

  const showSuccess = useCallback(
    ({ response, onCancel, onConfirm }: ShowBaseArgs) => {
      setAlert({
        response: {
          ...response,
          status: response.status ?? 200,
          variant: response.variant ?? 'success',
          cancelLabel: response.cancelLabel ?? 'Close',
        },
        onCancel: onCancel ?? closeAlert,
        onConfirm,
      });
    },
    [closeAlert]
  );

  const showConfirm = useCallback(
    ({ response, onConfirm, onCancel }: ShowConfirmArgs) => {
      setAlert({
        response: {
          ...response,
          status: response.status ?? 200,
          variant: 'confirm',
          confirmLabel: response.confirmLabel || 'Confirm',
          cancelLabel: response.cancelLabel ?? 'Cancel',
        },
        onCancel: onCancel ?? closeAlert,
        onConfirm,
      });
    },
    [closeAlert]
  );

  return { alert, showError, showSuccess, showConfirm, showLoading, closeAlert };
}
