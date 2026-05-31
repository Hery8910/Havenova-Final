'use client';
import { useState, useCallback } from 'react';

export type AlertVisualState = 'loading' | 'error' | 'success' | 'confirm' | 'warning' | 'info';

type AlertActionableState = Exclude<AlertVisualState, 'loading'>;

interface AlertPayloadBase {
  status?: number;
  title: string;
  description?: string;
}

export interface LoadingAlertPayload extends AlertPayloadBase {
  variant: 'loading';
}

export interface ActionAlertPayload extends AlertPayloadBase {
  variant?: AlertActionableState;
  confirmLabel?: string;
  cancelLabel?: string;
}

export type AlertPayload = LoadingAlertPayload | ActionAlertPayload;

export interface AlertConfig {
  response: AlertPayload;
  onCancel?: () => void;
  onConfirm?: () => void;
}

type ShowBaseArgs = {
  response: ActionAlertPayload;
  onConfirm?: () => void;
  onCancel?: () => void;
};

type ShowConfirmArgs = {
  response: ActionAlertPayload & { confirmLabel: string; cancelLabel?: string };
  onConfirm: () => void;
  onCancel?: () => void;
};

type ShowLoadingArgs = {
  response: Omit<LoadingAlertPayload, 'variant'> & { status?: number };
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

  const createActionAlert = useCallback(
    ({
      response,
      onCancel,
      onConfirm,
      fallbackStatus,
      fallbackVariant,
      fallbackCancelLabel,
    }: ShowBaseArgs & {
      fallbackStatus: number;
      fallbackVariant: AlertActionableState;
      fallbackCancelLabel?: string;
    }): AlertConfig => ({
      response: {
        ...response,
        status: response.status ?? fallbackStatus,
        variant: response.variant ?? fallbackVariant,
        cancelLabel: response.cancelLabel ?? fallbackCancelLabel,
      },
      onCancel: onCancel ?? (response.cancelLabel ?? fallbackCancelLabel ? closeAlert : undefined),
      onConfirm,
    }),
    [closeAlert]
  );

  const showLoading = useCallback(({ response }: ShowLoadingArgs) => {
    setAlert({
      response: {
        status: response.status ?? 102,
        title: response.title,
        description: response.description,
        variant: 'loading',
      },
    });
  }, []);

  const showError = useCallback(
    ({ response, onCancel, onConfirm }: ShowBaseArgs) => {
      setAlert(
        createActionAlert({
          response,
          onCancel,
          onConfirm,
          fallbackStatus: 400,
          fallbackVariant: 'error',
          fallbackCancelLabel: 'Close',
        })
      );
    },
    [createActionAlert]
  );

  const showSuccess = useCallback(
    ({ response, onCancel, onConfirm }: ShowBaseArgs) => {
      setAlert(
        createActionAlert({
          response,
          onCancel,
          onConfirm,
          fallbackStatus: 200,
          fallbackVariant: 'success',
        })
      );
    },
    [createActionAlert]
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
