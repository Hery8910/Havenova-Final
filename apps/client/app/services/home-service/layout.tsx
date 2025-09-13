import { Metadata } from 'next';
import { ReactNode, useState } from 'react';
import { homeServiceMetadata } from '../../pageMetadata';
export const metadata: Metadata = homeServiceMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
