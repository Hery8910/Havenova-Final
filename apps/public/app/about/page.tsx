import React from 'react';
import styles from './page.module.css';
import { AboutPageTexts } from '../../../../packages/types/pages/about';
import { useI18n } from '../../../../packages/contexts/I18nContext';
import Values from '../../../../packages/components/common/values/Values';

export default function AboutPage() {
  const { texts } = useI18n();
  const { hero, story, finalCta }: AboutPageTexts = texts.pages.about;

  return (
    <main className={styles.container}>
      {/* AboutHero */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>{hero.headline1}</h1>
          <h3>{hero.headline2}</h3>
          <p>
            <strong>{hero.subtitle}</strong>
          </p>
        </div>
      </section>

      {/* AboutStory */}
      <section className={styles.story}>
        <h3 className={styles.h3}>{story.title}</h3>
        {story.paragraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </section>

      {/* Values */}
      <Values />

      {/* AboutDifferentiators */}
      {/* <WhyChoose /> */}

      {/* Servicios */}
      {/* <Service /> */}

      {/* Testimonios */}
      {/* <Reviews /> */}

      {/* Blog */}
    </main>
  );
}
