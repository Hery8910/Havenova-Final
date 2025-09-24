import styles from './AboutHero.module.css';

export interface AboutHeroProps {
  headline1: string;
  headline2: string;
  subtitle: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ headline1, headline2, subtitle }) => {
  return (
    <section className={styles.hero} role="region" aria-labelledby="about-hero-headline">
      <article className={styles.heroText}>
        <h1 id="about-hero-headline">{headline1}</h1>
        <h2>{headline2}</h2>
        <p>
          <strong>{subtitle}</strong>
        </p>
      </article>
    </section>
  );
};

export default AboutHero;
