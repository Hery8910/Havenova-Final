'use client';

import {
  AboutClientsSection,
  AboutStorySection,
} from '../../../../../../packages/components/client/pages/about';
import { PageHero, type PageHeroContent } from '../../../../../../packages/components/client/pages/hero';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

export interface AboutPageTexts {
  hero: PageHeroContent;
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
  const lang = useLang();
  const { texts } = useI18n();
  const about: AboutPageTexts = texts?.pages?.client?.about;

  if (!about) return null;

  return (
    <main className={styles.main}>
      <PageHero texts={about.hero} lang={lang} />
      <AboutStorySection texts={about.story} />
      <AboutClientsSection texts={about.clients} />
    </main>
  );
}
