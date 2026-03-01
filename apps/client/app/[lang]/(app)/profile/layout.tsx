// app/profile/layout.tsx
import React, { ReactNode } from 'react';
import styles from './layout.module.css';
import { Metadata } from 'next';
import { getPageMetadata } from '../../../../../../packages/utils/metadata';
import { ProfileHeader, ProfileNav } from '../../../../../../packages/components';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'profile');
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.layout}>
      <ProfileHeader />
      <ProfileNav />
      {children}
    </main>
  );
}
