import Image from 'next/image';
import styles from './hero.module.css';

export default function Hero({
  texts,
}: {
  texts: {
    icon: {
      src: string;
      alt: string;
    };
    title: string;
    accent: string;
    title2: string;
    description: string;
  };
}) {
  return (
    <header className={styles.header} aria-labelledby="cleaning-hero-title">
      <article className={styles.container}>
        <Image
          className={styles.icon}
          src={texts.icon.src}
          alt={texts.icon.alt}
          width={72}
          height={72}
          priority
        />
        <h1 id="cleaning-hero-title" className={styles.title}>
          {texts.title} <span className={styles.accent}>{texts.accent}</span> {texts.title2}
        </h1>
        <p className={styles.description}>{texts.description}</p>
      </article>
    </header>
  );
}
