// cookies/components/GAScript.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookies } from '../../contexts/cookies/CookiesContext';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: any[]) => void;
  }
}

const GAScript: React.FC = () => {
  const { prefs } = useCookies();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [loaded, setLoaded] = useState(false);
  const seededRef = useRef(false);

  // 1) Seed dataLayer + Consent Mode default=denied (solo una vez)
  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;

    window.dataLayer = window.dataLayer || [];
    function gtag(
      p0: string,
      p1: string,
      p2: {
        analytics_storage: string;
        ad_storage: string;
        ad_user_data: string;
        ad_personalization: string;
      }
    ) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    // Consent Mode por defecto (EEE: denied)
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }, []);

  // 2) Carga GA solo si hay consentimiento de estadísticas
  useEffect(() => {
    if (!gaId) return; // No configurado
    if (!prefs.consent.statistics) {
      // Sin consentimiento → ensure denied
      if (window.gtag) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
      }
      return;
    }
    if (loaded) return; // Ya cargado una vez

    // Actualiza consentimiento → granted
    window.gtag('consent', 'update', { analytics_storage: 'granted' });

    // Inserta el script oficial
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    s.onload = () => {
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        anonymize_ip: true,
        // En GA4, el page path lo enviaremos también en cada navegación
      });
      setLoaded(true);
    };
    document.head.appendChild(s);
  }, [prefs.consent.statistics, gaId, loaded]);

  // 3) Pageviews: App Router (escucha cambios de ruta)
  useEffect(() => {
    if (!gaId || !loaded || !prefs.consent.statistics) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    // GA4: usar gtag('config', ...) para marcar page_view
    window.gtag('config', gaId, { page_path: url });
  }, [pathname, searchParams, gaId, loaded, prefs.consent.statistics]);

  return null;
};

export default GAScript;
