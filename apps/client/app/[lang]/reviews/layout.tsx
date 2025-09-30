import { Metadata } from 'next';

import { reviewsMetadata } from '../../pageMetadata';

export const metadata: Metadata = reviewsMetadata;

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
