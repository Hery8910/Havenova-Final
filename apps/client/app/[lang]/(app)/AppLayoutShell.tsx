'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { Footer } from '@/packages/components/client/footer';
import { NavbarContainer } from '@/packages/components/client/navbar';

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHideFooter = /^\/[a-z]{2}\/profile(?:\/|$)/i.test(pathname ?? '');

  return (
    <>
      <NavbarContainer />
      {children}
      {!shouldHideFooter ? <Footer /> : null}
    </>
  );
}
