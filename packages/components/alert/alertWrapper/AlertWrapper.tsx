'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import { AlertPopup, AlertPopupSkeleton } from '../alertPopup';
import { getAlertType } from '../../../utils/alertType';

interface BackendResponse {
  status: number;
  title: string;
  description: string;
}

interface AlertWrapperProps {
  response: BackendResponse | null;
  onClose?: () => void;
}

export default function AlertWrapper({ response, onClose }: AlertWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    },
    [onClose]
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

  return (
    <div ref={containerRef} tabIndex={-1}>
      <AlertPopup
        type={type}
        title={response.title}
        description={response.description}
        onClose={onClose}
      />
    </div>
  );
}
