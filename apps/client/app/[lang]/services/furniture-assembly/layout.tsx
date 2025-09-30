import { Metadata } from 'next';
import { ReactNode } from 'react';
import { furnitureAssemblyMetadata } from '../../../pageMetadata';

export const metadata: Metadata = furnitureAssemblyMetadata;

export default function ServiceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
