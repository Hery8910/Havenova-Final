import { Metadata } from 'next';

import { servicesMetadata } from '../../pageMetadata';

export const metadata: Metadata = servicesMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
