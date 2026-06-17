'use client';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCookies } from '@havenova/contexts/cookies';
import { useI18n } from '@havenova/contexts/i18n';
import { CookieBannerView } from './CookieBannerView';

export function CookieBannerContainer() {
  const { showBanner, loading, saveSelection } = useCookies();
  const { texts } = useI18n();

  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const cookieTexts = texts?.components?.client.cookieBanner;

  const handleAcknowledge = useCallback(() => {
    saveSelection({});
  }, [saveSelection]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (loading) return;

    if (showBanner) {
      setIsRendered(true);
      const frame = window.requestAnimationFrame(() => setIsOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsOpen(false);
    const timeoutId = window.setTimeout(() => setIsRendered(false), 240);
    return () => window.clearTimeout(timeoutId);
  }, [loading, showBanner]);

  useEffect(() => {
    if (!isRendered) return;

    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusableElements = () => {
      if (!dialog) return [];

      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleAcknowledge();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [handleAcknowledge, isRendered]);

  if (!cookieTexts || loading || !isRendered || !portalReady) return null;

  return createPortal(
    <CookieBannerView
      texts={cookieTexts}
      isOpen={isOpen}
      dialogRef={dialogRef}
      titleId={titleId}
      descriptionId={descriptionId}
      onAcknowledge={handleAcknowledge}
    />,
    document.body
  ) as unknown as JSX.Element;
}
