import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PageHero.module.css';
import { href } from '../../../../utils';

export interface PageHeroAction {
  label: string;
  href: string;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary';
}

export interface PageHeroImage {
  src: string;
  alt: string;
  priority?: boolean;
}

export interface PageHeroContent {
  title: string;
  descriptions: string[];
  ctas?: {
    primary?: PageHeroAction;
    secondary?: PageHeroAction;
  };
  image: PageHeroImage;
  a11y?: {
    actionsLabel?: string;
  };
}

export interface PageHeroProps {
  texts: PageHeroContent;
  lang: 'de' | 'en' | 'es';
}

export function PageHero({ texts, lang }: PageHeroProps) {
  const titleId = useId();
  const descriptionId = useId();
  const ctas = [texts.ctas?.primary, texts.ctas?.secondary].filter(Boolean) as PageHeroAction[];
  const hasDescriptions = texts.descriptions.length > 0;
  const actionsLabel = texts.a11y?.actionsLabel;

  return (
    <section
      className={styles.hero}
      aria-labelledby={titleId}
      aria-describedby={hasDescriptions ? descriptionId : undefined}
    >
      <div className={styles.container}>
        <div className={styles.heroMedia}>
          <div className={styles.heroMediaFrame}>
            <Image
              className={styles.heroImage}
              src={texts.image.src}
              alt={texts.image.alt}
              fill
              priority={texts.image.priority ?? true}
              sizes="100vw"
            />
          </div>
        </div>

        <div className={styles.heroContent}>
          <header className={styles.heroCopy}>
            <h1 id={titleId} className={`${styles.heroTitle} type-display-lg`}>
              {texts.title}
            </h1>

            <div
              id={hasDescriptions ? descriptionId : undefined}
              className={styles.heroDescriptions}
            >
              {texts.descriptions.map((description) => (
                <p key={description} className={`${styles.heroDescription} type-body-lg`}>
                  {description}
                </p>
              ))}
            </div>

            {ctas.length > 0 && (
              <nav className={styles.heroCtas} aria-label={actionsLabel}>
                {ctas.map((cta, index) => {
                  const isPrimary = cta.variant ? cta.variant === 'primary' : index === 0;

                  return (
                    <Link
                      key={`${cta.href}-${cta.label}`}
                      className={`button ${isPrimary ? 'button--primary' : 'button--secondary'} ${styles.cta}`}
                      href={href(lang, cta.href)}
                      aria-label={cta.ariaLabel}
                    >
                      {cta.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </header>
        </div>
      </div>
    </section>
  );
}
