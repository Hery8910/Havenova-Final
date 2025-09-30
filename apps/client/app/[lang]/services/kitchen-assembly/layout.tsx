import { Metadata } from 'next';
import { ReactNode } from 'react';
import { kitchenAssemblyMetadata } from '../../../pageMetadata';
export const metadata: Metadata = kitchenAssemblyMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
