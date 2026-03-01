import React from 'react';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../../../packages/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'auth');
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
