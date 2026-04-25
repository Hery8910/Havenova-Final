// packages/contexts/alert/AlertContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAlertBase } from './useAlert';
import { AlertWrapper } from '@havenova/components/alert/alertWrapper';
import { createPortal } from 'react-dom';

const AlertContext = createContext<ReturnType<typeof useAlertBase> | null>(null);
const ALERT_EXIT_MS = 280;

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const alert = useAlertBase();
  const [renderedAlert, setRenderedAlert] = useState(alert.alert);
  const [isOpen, setIsOpen] = useState(Boolean(alert.alert));

  useEffect(() => {
    if (alert.alert) {
      setRenderedAlert(alert.alert);
      setIsOpen(true);
      return;
    }

    if (!renderedAlert) return;

    setIsOpen(false);
    const timeoutId = window.setTimeout(() => {
      setRenderedAlert(null);
    }, ALERT_EXIT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [alert.alert, renderedAlert]);

  return (
    <AlertContext.Provider value={alert}>
      {children}
      {renderedAlert &&
        createPortal(
          <AlertWrapper
            response={renderedAlert.response}
            isOpen={isOpen}
            onCancel={renderedAlert.onCancel}
            onConfirm={renderedAlert.onConfirm}
          />,
          document.body
        )}
    </AlertContext.Provider>
  );
}

export function useGlobalAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useGlobalAlert must be used within an AlertProvider');
  }
  return context;
}
