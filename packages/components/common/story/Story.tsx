import styles from './Story.module.css';

export interface StoryProps {
  title: string;
  paragraphs: string[];
}

const Story: React.FC<StoryProps> = ({ title, paragraphs }) => {
  return (
    <section className={styles.story} role="region" aria-labelledby="story-headline">
      <h2 className={styles.h3} id="story-headline">
        {title}
      </h2>
      {paragraphs.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </section>
  );
};

export default Story;
