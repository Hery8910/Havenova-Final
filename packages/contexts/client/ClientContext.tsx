'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import {
  ClientLegalUpdates,
  ClientPublicConfig,
  ClientContextProps,
} from '../../types/client/clientTypes';
import Loading from '@havenova/components/loading/Loading';
import { useGlobalAlert } from '../alert';
import { useI18n } from '../i18n';
import { getPopup } from '@havenova/utils';
import { fallbackButtons, fallbackPopups } from '../i18n';

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

type LegacyLegalUpdates = {
  lastPrivacyUpdate?: string;
  lastCookiesUpdate?: string;
  lastTermsUpdate?: string;
};

function normalizeLegalUpdates(
  legalUpdates?: ClientLegalUpdates | LegacyLegalUpdates | null
): ClientLegalUpdates {
  if (!legalUpdates) return {};

  const legacy = legalUpdates as LegacyLegalUpdates;
  const modern = legalUpdates as ClientLegalUpdates;

  return {
    privacy: {
      ...modern.privacy,
      updatedAt: modern.privacy?.updatedAt ?? legacy.lastPrivacyUpdate,
    },
    cookies: {
      ...modern.cookies,
      updatedAt: modern.cookies?.updatedAt ?? legacy.lastCookiesUpdate,
    },
    terms: {
      ...modern.terms,
      updatedAt: modern.terms?.updatedAt ?? legacy.lastTermsUpdate,
    },
  };
}

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
  const popups = texts?.popups ?? {};

  useEffect(() => {
    // Si initialClient viene desde el layout (como tú haces), esto ya resuelve todo
    if (initialClient) {
      const normalizedClient = {
        ...initialClient,
        legalUpdates: normalizeLegalUpdates(initialClient.legalUpdates),
      };
      setClient(normalizedClient);
    }

    setLoading(false);
  }, [initialClient]);

  useEffect(() => {
    if (loading || client || didNotifyRef.current) return;
    didNotifyRef.current = true;

    const popup = getPopup(
      popups,
      'CLIENT_FETCH_FAILED',
      'CLIENT_FETCH_FAILED',
      fallbackPopups.CLIENT_FETCH_FAILED
    );

    showConfirm({
      response: {
        status: 500,
        title: popup.title,
        description: popup.description,
        confirmLabel:
          popup.confirm ??
          popups?.button?.reload ??
          fallbackButtons.reload ??
          popups?.button?.continue ??
          fallbackButtons.continue,
        cancelLabel: popup.close ?? popups?.button?.close ?? fallbackButtons.close,
      },
      onConfirm: () => {
        closeAlert();
        window.location.reload();
      },
      onCancel: closeAlert,
    });
  }, [client, closeAlert, loading, showConfirm, popups]);

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
