import styles from './HowItWorksHeroSection.module.css';
import { IoLocationOutline } from 'react-icons/io5';

export default function HowItWorksHeroSection({
  texts,
}: {
  texts: {
    kicker: string;
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
      badgeTitle: string;
    };
  };
}) {
  return (
    <section className={styles.hero} aria-labelledby="how-it-works-hero-title">
      <span className={styles.heroPattern} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <header className={styles.heroCopy}>
            <span className={styles.heroBadge}>{texts.kicker}</span>
            <h1 id="how-it-works-hero-title" className={styles.heroTitle}>
              {texts.title}
            </h1>
            <p className={styles.heroSubtitle}>{texts.description}</p>
          </header>
          <figure className={styles.heroImageWrap}>
            <img className={styles.heroImage} src={texts.image.src} alt={texts.image.alt} />
            <figcaption className={styles.heroCard} aria-hidden="true">
              <p className={styles.heroCardTag}>
                <IoLocationOutline /> {texts.image.badgeTitle}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
