import styles from './hero.module.css';

export default function Hero({
  texts,
}: {
  texts: {
    title: string;
    description: string;
  };
}) {
  return (
    <header className={styles.header} aria-labelledby="about-intro-title">
      <article className={styles.container}>
        <h1 id="about-intro-title" className={styles.title}>
          {texts.title}
        </h1>
        <p className={styles.description}>{texts.description}</p>
      </article>
    </header>
  );
}
