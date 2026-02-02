'use client';

import {
  AboutClientsSection,
  AboutIntroSection,
  AboutStorySection,
} from '../../../../../../packages/components/client/pages/about';
import { useI18n } from '../../../../../../packages/contexts';
import styles from './page.module.css';

export interface AboutPageTexts {
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

export default function About() {
  const { texts } = useI18n();
  const about: AboutPageTexts = texts?.pages?.client?.about;

  if (!about) return null;

  return (
    <main className={styles.main}>
      <AboutIntroSection texts={about.intro} />
      <AboutStorySection texts={about.story} />
      <AboutClientsSection texts={about.clients} />
    </main>
  );
}
