'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';
import Loading from '@/packages/components/loading/Loading';

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

  useEffect(() => {
    // Si initialClient viene desde el layout (como tú haces), esto ya resuelve todo
    if (initialClient) {
      setClient(initialClient);
    }

    setLoading(false);
  }, [initialClient]);

  // Estado de carga → NO renderiza nada
  if (loading || !client) {
    return <Loading theme={'light'} />; // o tu componente Loading
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
