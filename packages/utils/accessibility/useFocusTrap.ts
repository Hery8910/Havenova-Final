'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function isVisible(element: HTMLElement) {
  return !element.hasAttribute('hidden') && element.getClientRects().length > 0;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);
}

type UseFocusTrapParams = {
  enabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
};

export function useFocusTrap({
  enabled,
  containerRef,
  initialFocusRef,
  returnFocusRef,
  onEscape,
}: UseFocusTrapParams) {
  useEffect(() => {
    if (!enabled) return;

    const frameId = window.requestAnimationFrame(() => {
      const container = containerRef.current;

      if (!container) return;

      const preferredTarget = initialFocusRef?.current;

      if (preferredTarget && isVisible(preferredTarget)) {
        preferredTarget.focus();
        return;
      }

      const [firstFocusable] = getFocusableElements(container);

      if (firstFocusable) {
        firstFocusable.focus();
        return;
      }

      container.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [containerRef, enabled, initialFocusRef]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;

      if (!container) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onEscape?.();

        if (returnFocusRef?.current) {
          window.requestAnimationFrame(() => {
            returnFocusRef.current?.focus();
          });
        }

        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      const activeElement = document.activeElement as HTMLElement | null;

      if (!focusableElements.length) {
        event.preventDefault();
        container.focus();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (!activeElement || !container.contains(activeElement)) {
        if (returnFocusRef?.current && activeElement === returnFocusRef.current && !event.shiftKey) {
          event.preventDefault();
          firstFocusable.focus();
        }

        if (returnFocusRef?.current && activeElement === returnFocusRef.current && event.shiftKey) {
          event.preventDefault();
          lastFocusable.focus();
        }

        return;
      }

      if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [containerRef, enabled, onEscape, returnFocusRef]);
}
