import Image from 'next/image';
import styles from './FAQHero.module.css';

export interface FAQHeroProps {
  headline1: string;
  headline2: string;
  subtitle: string;
  image: string;
}

const FAQHero: React.FC<FAQHeroProps> = ({ headline1, headline2, subtitle, image }) => {
  return (
    <section className={styles.section} role="region" aria-labelledby="faq-hero-headline">
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 id="faq-hero-headline">{headline1}</h1>
          <h2 className={styles.h2}>{headline2}</h2>
          <p>{subtitle}</p>
        </header>

        <Image
          src={image}
          alt="" // decorative
          width={400}
          height={400}
          priority={true}
          fetchPriority="auto"
          className={styles.image}
          quality={75}
        />
      </article>
    </section>
  );
};

export default FAQHero;
