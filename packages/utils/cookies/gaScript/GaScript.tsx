'use client';

import Script from 'next/script';
import { loadCookiePrefs } from '../cookieStorage/cookieStorage';

/**
 * Inyecta el script de Google Analytics solo si el usuario aceptó estadísticas.
 * Asegúrate de tener tu ID de medición (G-XXXXXXXXXX) en process.env.
 */
export default function GaScript() {
  const prefs = loadCookiePrefs();

  if (!prefs?.consent.statistics) {
    return null; // ❌ No insertar GA si no hay consentimiento
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID; // ⚠️ Definir en tu .env.local

  if (!gaId) {
    console.warn('⚠️ GaScript: Falta NEXT_PUBLIC_GA_ID en .env.local');
    return null;
  }

  return (
    <>
      {/* Script oficial de GA */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />

      {/* Inicialización de GA */}
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}
      </Script>
    </>
  );
}
