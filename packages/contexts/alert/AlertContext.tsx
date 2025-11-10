'use client';
import React, { createContext, useContext } from 'react';
import { useAlertBase } from './useAlert';
import { AlertWrapper } from '@havenova/components/alert/alertWrapper';

const AlertContext = createContext<ReturnType<typeof useAlertBase> | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const alert = useAlertBase();

  return (
    <AlertContext.Provider value={alert}>
      {alert.alert && (
        <AlertWrapper
          response={alert.alert.response}
          onCancel={alert.alert.onCancel}
          onConfirm={alert.alert.onConfirm}
        />
      )}
      {children}
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
