import { Metadata } from 'next';
import { ReactNode } from 'react';
import { kitchenCleaningMetadata } from '../../../pageMetadata';

export const metadata: Metadata = kitchenCleaningMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
