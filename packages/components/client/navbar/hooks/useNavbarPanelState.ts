'use client';

import { useCallback, useEffect, useState } from 'react';

interface UseNavbarPanelStateOptions {
  persistOnClose?: boolean;
}

export function useNavbarPanelState<PanelId extends string>({
  persistOnClose = false,
}: UseNavbarPanelStateOptions = {}) {
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [renderedPanel, setRenderedPanel] = useState<PanelId | null>(null);

  useEffect(() => {
    if (activePanel && persistOnClose) {
      setRenderedPanel(activePanel);
    }
  }, [activePanel, persistOnClose]);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const openPanel = useCallback((panel: PanelId) => {
    setActivePanel(panel);
  }, []);

  const togglePanel = useCallback((panel: PanelId) => {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  }, []);

  const isPanelOpen = useCallback(
    (panel: PanelId) => activePanel === panel,
    [activePanel]
  );

  const visiblePanel = persistOnClose ? activePanel ?? renderedPanel : activePanel;

  const handlePanelTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLElement>) => {
      if (
        !persistOnClose ||
        event.target !== event.currentTarget ||
        event.propertyName !== 'transform' ||
        activePanel
      ) {
        return;
      }

      setRenderedPanel(null);
    },
    [activePanel, persistOnClose]
  );

  return {
    activePanel,
    visiblePanel,
    isAnyPanelOpen: Boolean(activePanel),
    openPanel,
    closePanel,
    togglePanel,
    isPanelOpen,
    handlePanelTransitionEnd,
  };
}
