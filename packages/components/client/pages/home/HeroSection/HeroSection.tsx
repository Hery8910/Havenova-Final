import Link from 'next/link';
import styles from './HeroSection.module.css';
import { href } from '../../../../../utils/navigation';
import { IoLocationOutline } from 'react-icons/io5';

export default function HeroSection({
  texts,
  lang,
}: {
  texts: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctas: {
      cleaning: { label: string; href: string };
      maintenance: { label: string; href: string };
    };
    image: {
      src: string;
      alt: string;
      badgeTitle: string;
      tag: string;
    };
  };
  lang: 'de' | 'en';
}) {
  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <span className={styles.heroPattern} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <header className={styles.heroCopy}>
            <span className={styles.heroBadge}>{texts.badge}</span>
            <h1 id="home-hero-title" className={styles.heroTitle}>
              {texts.title} <span className={styles.heroTitleAccent}>{texts.titleAccent}</span>
            </h1>
            <p className={styles.heroSubtitle}>{texts.subtitle}</p>
            <nav className={styles.heroCtas} aria-label="Hero actions">
              <Link
                className={`${styles.ctaPrimary} button`}
                href={href(lang, texts.ctas.cleaning.href)}
              >
                {texts.ctas.cleaning.label}
              </Link>
              <Link
                className={`${styles.ctaSecondary} button`}
                href={href(lang, texts.ctas.maintenance.href)}
              >
                {texts.ctas.maintenance.label}
              </Link>
            </nav>
          </header>
          <figure className={styles.heroImageWrap}>
            <img className={styles.heroImage} src={texts.image.src} alt={texts.image.alt} />
            <figcaption className={styles.heroCard} aria-hidden="true">
              <p className={styles.heroCardTag}>
                <IoLocationOutline /> {texts.image.tag}
              </p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
