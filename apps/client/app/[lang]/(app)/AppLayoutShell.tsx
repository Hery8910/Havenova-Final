'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useI18n } from '@/packages/contexts';
import { Footer } from '@/packages/components/client/footer';
import { NavbarContainer } from '@/packages/components/client/navbar';
import styles from './AppLayoutShell.module.css';

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { texts } = useI18n();
  const shouldHideFooter = /^\/[a-z]{2}\/profile(?:\/|$)/i.test(pathname ?? '');
  const skipToContentLabel =
    texts?.components?.client?.navbar?.accessibility?.skipToContent ?? 'Skip to main content';

  return (
    <>
      <a className={styles.skipLink} href="#app-main-content">
        {skipToContentLabel}
      </a>
      <NavbarContainer />
      {children}
      {!shouldHideFooter ? <Footer /> : null}
    </>
  );
}
