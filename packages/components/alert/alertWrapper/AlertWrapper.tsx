// packages/components/alert/alertWrapper/AlertWrapper.tsx
'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { AlertPopup, AlertPopupSkeleton } from '../alertPopup';
import { getAlertType } from '../../../utils/alertType';
import type { AlertPopupProps } from '../alertPopup/AlertPopup';

type AlertResponse = Omit<AlertPopupProps, 'type' | 'onConfirm' | 'onCancel'> & { status: number };

interface AlertWrapperProps {
  response: AlertResponse | null;
  onCancel: () => void;
  onConfirm?: () => void;
}

export default function AlertWrapper({ response, onCancel, onConfirm }: AlertWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    if (!response) return;
    document.addEventListener('keydown', handleKeyDown);
    containerRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [response, handleKeyDown]);

  if (!response) return <AlertPopupSkeleton />;

  const type = getAlertType(response.status);
  const hasConfirm = !!onConfirm && !!response.confirmLabel;

  return (
    <AlertPopup
      type={type}
      title={response.title}
      description={response.description}
      cancelLabel={response.cancelLabel}
      confirmLabel={response.confirmLabel}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
