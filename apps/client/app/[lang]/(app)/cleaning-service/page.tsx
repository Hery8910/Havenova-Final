'use client';

import { Hero } from '../../../../../../packages/components/client/pages/cleaning-service';
import { useI18n } from '../../../../../../packages/contexts';
import styles from './page.module.css';

export interface CleaningServicePageTexts {
  intro: { title: string; description: string };
  story: {
    title: string;
    paragraphs: string[];
  };
  clients: {
    title: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
    closing: string;
  };
}

export default function CleaningService() {
  const { texts } = useI18n();
  const cleaning: CleaningServicePageTexts = texts?.pages?.client?.about;

  if (!cleaning) return null;

  return (
    <main className={styles.main}>
      <Hero texts={cleaning.intro} />
    </main>
  );
}
