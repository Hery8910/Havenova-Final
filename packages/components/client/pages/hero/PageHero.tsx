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
  descriptions: string | string[];
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
  position?: number;
}

function resolveDescriptionText(value: string | string[]): string {
  if (Array.isArray(value)) {
    return value.find((item) => item.trim())?.trim() || '';
  }

  return value.trim();
}

export function PageHero({ texts, lang, position }: PageHeroProps) {
  const titleId = useId();
  const descriptionId = useId();
  const ctas = [texts.ctas?.primary, texts.ctas?.secondary].filter(Boolean) as PageHeroAction[];
  const actionsLabel = texts.a11y?.actionsLabel ?? 'Aktionen im Startseiten-Hero';
  const descriptionText = resolveDescriptionText(texts.descriptions);
  const descriptionLinkId = descriptionText ? descriptionId : undefined;
  const imageStyle = position !== undefined ? { objectPosition: `${position}% center` } : undefined;

  return (
    <header className={styles.hero} aria-labelledby={titleId} aria-describedby={descriptionLinkId}>
      <div className={styles.heroMedia}>
        <div className={styles.heroMediaFrame}>
          <Image
            className={styles.heroImage}
            src={texts.image.src}
            alt={texts.image.alt}
            fill
            priority={texts.image.priority ?? true}
            sizes="100vw"
            style={imageStyle}
          />

          <h1 id={titleId} className={`${styles.heroTitle} type-display-lg`}>
            {texts.title}
          </h1>
        </div>
      </div>

      <article className={styles.heroCopy}>
        {descriptionText ? (
          <p id={descriptionId} className={`${styles.heroDescription} type-body-lg`}>
            {descriptionText}
          </p>
        ) : null}

        {ctas.length > 0 && (
          <nav className={styles.heroCtas} aria-label={actionsLabel}>
            {ctas.map((cta, index) => {
              const isPrimary = cta.variant ? cta.variant === 'primary' : index === 0;

              return (
                <Link
                  key={`${cta.href}-${cta.label}`}
                  className={`v2-button ${isPrimary ? 'v2-button--primary' : 'v2-button--secondary'} ${styles.cta}`}
                  href={href(lang, cta.href)}
                  aria-label={cta.ariaLabel}
                >
                  {cta.label}
                </Link>
              );
            })}
          </nav>
        )}
      </article>
    </header>
  );
}
