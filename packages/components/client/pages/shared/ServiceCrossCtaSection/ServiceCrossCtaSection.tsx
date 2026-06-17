import Link from 'next/link';
import Image from 'next/image';
import { useId } from 'react';
import styles from './ServiceCrossCtaSection.module.css';

export interface ServiceCrossCtaAction {
  label: string;
  href: string;
  ariaLabel?: string;
  variant?: string;
}

export interface ServiceCrossCtaSectionTexts {
  eyebrow?: string;
  title: string;
  description: string;
  a11y?: {
    sectionLabel?: string;
    actionsLabel?: string;
  };
  actions: ServiceCrossCtaAction[];
}

interface ServiceCrossCtaSectionProps {
  texts: ServiceCrossCtaSectionTexts;
  lang: string;
  surface: 'about' | 'cleaning-service' | 'home-service';
}

const SURFACE_CONFIG = {
  about: {
    cardClass: 'card--accent',
    imageSrc: '/images/cleaning.png',
  },
  'cleaning-service': {
    cardClass: 'card--primary',
    imageSrc: '/images/cleaning.png',
  },
  'home-service': {
    cardClass: 'card--secondary',
    imageSrc: '/images/home-service.png',
  },
} as const;

const getLocalizedHref = (href: string, lang: string) => {
  if (!href.startsWith('/') || href.startsWith(`/${lang}/`) || href === `/${lang}`) {
    return href;
  }

  return `/${lang}${href}`;
};

export default function ServiceCrossCtaSection({
  texts,
  lang,
  surface,
}: ServiceCrossCtaSectionProps) {
  const titleId = useId();
  const descriptionId = useId();
  const surfaceConfig = SURFACE_CONFIG[surface];

  return (
    <section
      className={`card ${surfaceConfig.cardClass} ${styles.section}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-label={texts.a11y?.sectionLabel}
    >
      <div className={styles.content}>
        <div className={styles.copy}>
          <header className={styles.header}>
            {texts.eyebrow ? <p className={`${styles.eyebrow} type-body-sm`}>{texts.eyebrow}</p> : null}
            <h2 id={titleId} className={`${styles.title} type-title-lg`}>
              {texts.title}
            </h2>
            <p id={descriptionId} className={`${styles.description} type-body-md`}>
              {texts.description}
            </p>
          </header>

          <nav className={styles.actions} aria-label={texts.a11y?.actionsLabel}>
            <ul className={styles.actionList}>
              {texts.actions.map((action) => {
                const variantClass =
                  action.variant === 'secondary'
                    ? 'button--secondary'
                    : action.variant === 'accent'
                      ? 'button--accent'
                      : action.variant === 'outline'
                        ? 'button--outline'
                        : 'button--primary';

                return (
                  <li key={`${action.href}-${action.label}`} className={styles.actionItem}>
                    <Link
                      className={`button ${variantClass} ${styles.button}`}
                      href={getLocalizedHref(action.href, lang)}
                      aria-label={action.ariaLabel}
                    >
                      {action.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className={styles.media} aria-hidden="true">
          <Image
            className={styles.image}
            src={surfaceConfig.imageSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 32vw"
          />
        </div>
      </div>
    </section>
  );
}
