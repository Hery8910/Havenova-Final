'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useGlobalAlert } from '@havenova/contexts/alert/AlertContext';
import { AlertWrapper } from '../alertWrapper';

const ALERT_EXIT_MS = 280;

export function AlertViewport() {
  const { alert } = useGlobalAlert();
  const [renderedAlert, setRenderedAlert] = useState(alert);
  const [isOpen, setIsOpen] = useState(Boolean(alert));

  useEffect(() => {
    if (alert) {
      setRenderedAlert(alert);
      setIsOpen(true);
      return;
    }

    if (!renderedAlert) return;

    setIsOpen(false);
    const timeoutId = window.setTimeout(() => {
      setRenderedAlert(null);
    }, ALERT_EXIT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [alert, renderedAlert]);

  if (!renderedAlert) return null;

  return (
    <>
      {createPortal(
        <AlertWrapper
          response={renderedAlert.response}
          isOpen={isOpen}
          onCancel={renderedAlert.onCancel}
          onConfirm={renderedAlert.onConfirm}
        />,
        document.body
      )}
    </>
  );
}
