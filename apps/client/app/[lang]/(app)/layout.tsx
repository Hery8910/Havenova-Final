import React from 'react';
import { NavbarContainer } from '../../../../../packages/components';
import { Footer } from '../../../../../packages/components/client/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarContainer />
      {children}
      <Footer />
    </>
  );
}
