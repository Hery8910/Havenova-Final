// packages/components/alert/alertWrapper/AlertWrapper.tsx
'use client';
import React, { useEffect, useCallback } from 'react';
import { AlertPopup } from '../alertPopup';
import { getAlertType } from '../../../utils/alertType';
import type { AlertPopupProps } from '../alertPopup/AlertPopup';

type AlertResponse = Omit<AlertPopupProps, 'type' | 'onConfirm' | 'onCancel'> & { status: number };

interface AlertWrapperProps {
  response: AlertResponse | null;
  onCancel: () => void;
  onConfirm?: () => void;
}

export default function AlertWrapper({ response, onCancel, onConfirm }: AlertWrapperProps) {
  const isDismissible = !!response && !response.loading && !!response.cancelLabel;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDismissible) onCancel();
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

  const type = getAlertType(response.status);

  return (
    <AlertPopup
      type={type}
      title={response.title}
      description={response.description}
      cancelLabel={response.cancelLabel}
      confirmLabel={response.confirmLabel}
      onCancel={onCancel}
      onConfirm={onConfirm}
      loading={response.loading}
    />
  );
}
