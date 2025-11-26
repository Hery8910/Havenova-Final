'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ClientPublicConfig, ClientContextProps } from '../../types/client/clientTypes';

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export function ClientProvider({
  children,
  initialClient,
}: {
  children: ReactNode;
  initialClient: ClientPublicConfig | null;
}) {
  const [client] = useState<ClientPublicConfig | null>(initialClient);
  const [loading] = useState(false);

  return <ClientContext.Provider value={{ client, loading }}>{children}</ClientContext.Provider>;
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}
