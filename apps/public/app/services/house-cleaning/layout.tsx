import { Metadata } from 'next';
import { ReactNode } from 'react';
import { houseCleaningMetadata } from '../../pageMetadata';

export const metadata: Metadata = houseCleaningMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
