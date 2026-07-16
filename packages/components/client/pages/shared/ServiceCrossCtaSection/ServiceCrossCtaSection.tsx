import Link from 'next/link';
import Image from 'next/image';
import { useId } from 'react';
import styles from './ServiceCrossCtaSection.module.css';
import { href } from '../../../../../utils/navigation';

type ServiceCrossCtaButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline';
type ServiceCrossCtaSurface = 'about' | 'cleaning-service' | 'home-service';

export interface ServiceCrossCtaAction {
  label: string;
  href: string;
  ariaLabel?: string;
  variant?: ServiceCrossCtaButtonVariant;
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
  surface: ServiceCrossCtaSurface;
}

const SURFACE_CONFIG: Record<
  ServiceCrossCtaSurface,
  {
    cardClass: 'card--accent' | 'card--primary' | 'card--secondary';
    imageSrc: string;
  }
> = {
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
};

const BUTTON_VARIANT_CLASS: Record<ServiceCrossCtaButtonVariant, string> = {
  primary: 'button--primary',
  secondary: 'button--secondary',
  accent: 'button--accent',
  outline: 'button--outline',
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
                const variantClass = BUTTON_VARIANT_CLASS[action.variant ?? 'primary'];

                return (
                  <li key={`${action.href}-${action.label}`} className={styles.actionItem}>
                    <Link
                      className={`button ${variantClass} ${styles.button}`}
                      href={href(lang, action.href)}
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
