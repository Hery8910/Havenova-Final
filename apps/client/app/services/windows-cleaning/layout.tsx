import { Metadata } from 'next';
import { windowsCleaningMetadata } from '../../pageMetadata';
import { ReactNode } from 'react';

export const metadata: Metadata = windowsCleaningMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
