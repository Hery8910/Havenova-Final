import Link from 'next/link';
import styles from './HeroSection.module.css';
import { href } from '../../../../../utils/navigation';

export default function ContactHeroSection({
  texts,
  lang,
}: {
  texts: {
    title: string;
    subtitle: string;
    ctas: {
      cleaning: { label: string; href: string };
      maintenance: { label: string; href: string };
    };
  };
  lang: 'de' | 'en';
}) {
  return (
    <header className={styles.header} aria-labelledby="contact-intro-title">
      <article className={styles.container}>
        <h1 id="about-intro-title" className={styles.title}>
          {texts.title}
        </h1>
        <p className={styles.description}>{texts.subtitle}</p>
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
      </article>
    </header>
  );
}
