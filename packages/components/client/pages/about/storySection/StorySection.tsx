import styles from './StorySection.module.css';

export default function StorySection({
  texts,
}: {
  texts: {
    title: string;
    paragraphs: string[];
  };
}) {
  return (
    <section className={styles.section} aria-labelledby="about-story-title">
      <div className={styles.container}>
        <h2 id="about-story-title" className={`${styles.title} type-title-lg`}>
          {texts.title}
        </h2>
        <div className={styles.paragraphs}>
          {texts.paragraphs.map((paragraph, index) => (
            <p className={`${styles.paragraph} type-body-md`} key={`${index}-${paragraph.slice(0, 12)}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
