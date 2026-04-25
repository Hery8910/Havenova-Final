import React from 'react';
import { Footer } from '@/packages/components/client/footer';
import { NavbarContainer } from '@/packages/components/client/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarContainer />
      {children}
      <Footer />
    </>
  );
}
