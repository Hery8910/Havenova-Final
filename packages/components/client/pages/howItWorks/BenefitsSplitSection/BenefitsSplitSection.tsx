import styles from './BenefitsSplitSection.module.css';
import Link from 'next/link';
import { href } from '../../../../../utils';
import Image from 'next/image';

export default function BenefitsSplitSection({
  texts,
  lang,
}: {
  texts: {
    title: string;
    description: string;
    ctaCleaning: { label: string; href: string };
    ctaHomeServices: { label: string; href: string };
    ctaAriaLabel: string;
  };
  lang: 'de' | 'en';
}) {
  return (
    <section className={styles.benefits} aria-labelledby="how-it-works-benefits-title">
      <section className={styles.container} aria-labelledby="how-it-works-benefits-title">
        <header className={styles.header}>
          <h2 id="how-it-works-benefits-title" className={styles.title}>
            {texts.title}
          </h2>
          <p className={styles.subtitle}>{texts.description}</p>
          <nav className={styles.heroCtas} aria-label={texts.ctaAriaLabel}>
            <Link
              className={`${styles.ctaPrimary} button`}
              href={href(lang, texts.ctaCleaning.href)}
            >
              {texts.ctaCleaning.label}
            </Link>
            <Link
              className={`${styles.ctaSecondary} button`}
              href={href(lang, texts.ctaHomeServices.href)}
            >
              {texts.ctaHomeServices.label}
            </Link>
          </nav>
        </header>
        <figure className={styles.imageWrapper} aria-hidden="true">
          <Image
            src={'/images/benefits.webp'}
            alt=""
            width={500}
            height={350}
            className={styles.image}
          />
        </figure>
      </section>
    </section>
  );
}
