'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import Loading from '@havenova/components/loading/Loading';
import { useGlobalAlert } from '../alert';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { fallbackButtons, fallbackPopups } from '../i18n';

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export function ClientProvider({
  children,
  initialClient,
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
}) {
  const [client, setClient] = useState<ClientPublicConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const didNotifyRef = useRef(false);
  const { texts } = useI18n();
  const { showConfirm, closeAlert } = useGlobalAlert();

  useEffect(() => {
    // Si initialClient viene desde el layout (como tú haces), esto ya resuelve todo
    if (initialClient) {
      setClient(initialClient);
    }

    setLoading(false);
  }, [initialClient]);

  useEffect(() => {
    if (loading || client || didNotifyRef.current) return;
    didNotifyRef.current = true;

    const popup = getPopup(
      texts.popups,
      'CLIENT_FETCH_FAILED',
      'CLIENT_FETCH_FAILED',
      fallbackPopups.CLIENT_FETCH_FAILED
    );

    showConfirm({
      response: {
        status: 500,
        title: popup.title,
        description: popup.description,
        confirmLabel: 'Reload',
        cancelLabel: popup.close ?? texts.popups.button?.close ?? fallbackButtons.close,
      },
      onConfirm: () => {
        closeAlert();
        window.location.reload();
      },
      onCancel: closeAlert,
    });
  }, [client, closeAlert, loading, showConfirm, texts.popups]);

  // Estado de carga → NO renderiza nada
  if (loading) {
    return <Loading theme={'light'} />; // o tu componente Loading
  }

  if (!client) {
    return null;
  }

  return (
    <ClientContext.Provider value={{ client, loading: false }}>{children}</ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
