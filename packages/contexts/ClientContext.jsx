'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { applyBrandingToDOM } from '../utils/applyBrandingToDOM';
const ClientContext = createContext(undefined);
export function ClientProvider({ children, initialClient, }) {
    const [client, setClient] = useState(initialClient);
    const [loading, setLoading] = useState(true);
    //   const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const hostname = 'havenova.de';
    useEffect(() => {
        const fetchClient = async () => {
            try {
                const { data } = await api.get(`/api/clients/by-domain/${hostname}`);
                if (data?.client.branding && data?.client.typography) {
                    applyBrandingToDOM(data.client.branding, data.client.typography);
                }
                setClient(data.client);
            }
            catch (err) {
                console.error('Error loading client config:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [hostname]);
    return <ClientContext.Provider value={{ client, loading }}>{children}</ClientContext.Provider>;
}
export function useClient() {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClient must be used within a ClientProvider');
    }
    return context;
}
