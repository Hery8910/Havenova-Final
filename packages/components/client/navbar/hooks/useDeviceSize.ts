'use client';

import { useSyncExternalStore } from 'react';

export type NavbarDeviceSize = 'mobile' | 'tablet' | 'desktop';

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const TABLET_MEDIA_QUERY = '(min-width: 768px) and (max-width: 1499px)';

function getDeviceSize(): NavbarDeviceSize | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window.matchMedia(MOBILE_MEDIA_QUERY).matches) {
    return 'mobile';
  }

  if (window.matchMedia(TABLET_MEDIA_QUERY).matches) {
    return 'tablet';
  }

  return 'desktop';
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQueries = [
    window.matchMedia(MOBILE_MEDIA_QUERY),
    window.matchMedia(TABLET_MEDIA_QUERY),
  ];

  mediaQueries.forEach((query) => query.addEventListener('change', onStoreChange));

  return () => {
    mediaQueries.forEach((query) => query.removeEventListener('change', onStoreChange));
  };
}

export function useDeviceSize() {
  return useSyncExternalStore(subscribe, getDeviceSize, () => null);
}
