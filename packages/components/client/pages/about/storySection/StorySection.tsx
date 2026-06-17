import styles from './StorySection.module.css';
import type { AboutStoryTexts } from '../about.types';

export default function StorySection({ texts }: { texts: AboutStoryTexts }) {
  return (
    <section className={styles.section} aria-labelledby="about-story-title">
      <div className={styles.container}>
        <h2 id="about-story-title" className={`${styles.title} type-display-md`}>
          {texts.title}
        </h2>
        <div className={styles.paragraphs}>
          {texts.paragraphs.map((paragraph, index) => (
            <p
              className={`${styles.paragraph} type-body-md`}
              key={`${index}-${paragraph.slice(0, 12)}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
