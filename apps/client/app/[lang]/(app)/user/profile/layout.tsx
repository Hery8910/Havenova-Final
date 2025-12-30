// app/profile/layout.tsx
import React, { ReactNode } from 'react';
import styles from './layout.module.css';
import { Metadata } from 'next';

import { userProfileMetadata } from '../../../../pageMetadata';
import { ProfileHeader, ProfileNav } from '../../../../../../../packages/components';

export const metadata: Metadata = userProfileMetadata;

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <main className={styles.layout}>
      <ProfileHeader />
      <ProfileNav />
      {children}
    </main>
  );
}
