// app/profile/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { ProfileNav } from '@/packages/components/client/user/profile';
import { getPageMetadata } from '@/packages/utils/metadata';
import styles from './layout.module.css';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' | 'es' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'profile');
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <section className={`${styles.workspace} card card--primary`} aria-label="Profile workspace">
        <aside className={styles.navColumn} aria-label="Profile navigation">
          <ProfileNav />
        </aside>

        <section className={styles.section}>{children}</section>
      </section>
    </main>
  );
}
