import React from 'react';
import { Footer } from '../../../../../packages/components/client/footer/Footer';
import { NavbarContainer } from '../../../../../packages/components/client/navbar';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../../../packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'home');
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarContainer />
      {children}
      <Footer />
    </>
  );
}
