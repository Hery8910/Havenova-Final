// packages/contexts/alert/useAlert.ts
'use client';
import { useState, useCallback } from 'react';
import type { AlertPopupProps } from '@havenova/components/alert/alertPopup/AlertPopup';

export type AlertPayload = Omit<AlertPopupProps, 'type' | 'onConfirm' | 'onCancel'> & {
  status: number;
};

export interface AlertConfig {
  response: AlertPayload;
  onCancel: () => void;
  onConfirm?: () => void;
}

type ShowBaseArgs = {
  response: AlertPayload;
  onCancel?: () => void;
};

type ShowConfirmArgs = {
  response: AlertPayload & { confirmLabel: string; cancelLabel?: string };
  onConfirm: () => void;
  onCancel?: () => void;
};

type AlertHookReturn = {
  alert: AlertConfig | null;
  showError: (args: ShowBaseArgs) => void;
  showSuccess: (args: ShowBaseArgs) => void;
  showConfirm: (args: ShowConfirmArgs) => void;
  closeAlert: () => void;
};

export function useAlertBase(): AlertHookReturn {
  const [alert, setAlert] = useState<AlertConfig | null>(null);

  const closeAlert = useCallback(() => setAlert(null), []);

  const showError = useCallback(
    ({ response, onCancel }: ShowBaseArgs) => {
      setAlert({
        response: {
          ...response,
          status: response.status ?? 400,
          cancelLabel: response.cancelLabel ?? 'Close',
        },
        onCancel: onCancel ?? closeAlert,
      });
    },
    [closeAlert]
  );

  const showSuccess = useCallback(
    ({ response, onCancel }: ShowBaseArgs) => {
      setAlert({
        response: {
          ...response,
          status: response.status ?? 200,
          cancelLabel: response.cancelLabel ?? 'Close',
        },
        onCancel: onCancel ?? closeAlert,
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
          confirmLabel: response.confirmLabel || 'Confirm',
          cancelLabel: response.cancelLabel ?? 'Cancel',
        },
        onCancel: onCancel ?? closeAlert,
        onConfirm,
      });
    },
    [closeAlert]
  );

  return { alert, showError, showSuccess, showConfirm, closeAlert };
}
