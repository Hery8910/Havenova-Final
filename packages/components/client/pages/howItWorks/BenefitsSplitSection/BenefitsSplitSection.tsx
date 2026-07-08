import styles from './BenefitsSplitSection.module.css';
import Link from 'next/link';
import { href } from '../../../../../utils';
import Image from 'next/image';
import type { HowItWorksBenefitsTexts } from '../howItWorks.types';

export default function BenefitsSplitSection({
  texts,
  lang,
}: {
  texts: HowItWorksBenefitsTexts;
  lang: 'de' | 'en' | 'es';
}) {
  return (
    <section className={styles.benefits} aria-labelledby="how-it-works-benefits-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="how-it-works-benefits-title" className={`${styles.title} type-display-md`}>
            {texts.title}
          </h2>
          <p className={`${styles.subtitle} type-body-lg`}>{texts.description}</p>
          <nav className={styles.heroCtas} aria-label={texts.ctaAriaLabel}>
            <Link
              className={`${styles.ctaPrimary} button button--primary`}
              href={href(lang, texts.ctaCleaning.href)}
            >
              {texts.ctaCleaning.label}
            </Link>
            <Link
              className={`${styles.ctaSecondary} button button--secondary`}
              href={href(lang, texts.ctaHomeServices.href)}
            >
              {texts.ctaHomeServices.label}
            </Link>
          </nav>
        </header>
        <figure className={styles.imageWrapper} aria-hidden="true">
          <div className={styles.imageFrame}>
            <Image
              src={'/images/benefits.png'}
              alt=""
              width={550}
              height={350}
              sizes="(max-width: 1000px) 90vw, 42vw"
              className={styles.image}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
