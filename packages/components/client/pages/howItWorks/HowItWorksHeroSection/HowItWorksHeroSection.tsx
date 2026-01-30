import styles from './HowItWorksHeroSection.module.css';
import Link from 'next/link';
import { href } from '../../../../../utils/navigation';

export default function HowItWorksHeroSection({
  texts,
  lang,
}: {
  texts: {
    kicker: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
    ctaAriaLabel: string;
    image: {
      src: string;
      alt: string;
      badgeTitle: string;
    };
  };
  lang: 'de' | 'en';
}) {
  return (
    <header className={styles.hero} aria-labelledby="how-it-works-hero-title">
      <article className={styles.heroArticle}>
        <span className={styles.kicker}>{texts.kicker}</span>
        <h1 id="how-it-works-hero-title" className={styles.title}>
          {texts.title}
        </h1>
        <p className={styles.subtitle}>{texts.description}</p>
      </article>
      <figure className={styles.heroImageWrap}>
        <span className={styles.heroGlow} aria-hidden="true" />
        <img className={styles.heroImage} src={texts.image.src} alt={texts.image.alt} />
        <figcaption className={styles.heroCard} aria-hidden="true">
          <p className={styles.heroCardTitle}>{texts.image.badgeTitle}</p>
        </figcaption>
      </figure>
    </header>
  );
}
