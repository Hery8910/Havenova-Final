'use client';

import { RefObject, useEffect } from 'react';

interface UseDismissibleLayerOptions {
  enabled: boolean;
  refs: Array<RefObject<HTMLElement | null>>;
  onDismiss: () => void;
}

export function useDismissibleLayer({
  enabled,
  refs,
  onDismiss,
}: UseDismissibleLayerOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInsideLayer = refs.some((ref) => ref.current?.contains(target));

      if (!isInsideLayer) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onDismiss, refs]);
}
