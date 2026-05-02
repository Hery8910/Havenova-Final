import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './PageHero.module.css';
import { href } from '../../../../utils';

type HeroClassNameSlot =
  | 'root'
  | 'container'
  | 'media'
  | 'mediaFrame'
  | 'content'
  | 'copy'
  | 'badge'
  | 'title'
  | 'descriptions'
  | 'description'
  | 'ctas'
  | 'image';

export interface PageHeroAction {
  label: string;
  href: string;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export interface PageHeroImage {
  src: string;
  alt: string;
  priority?: boolean;
}

export interface PageHeroContent {
  badge?: string;
  title: string;
  descriptions: string[];
  ctas?: {
    primary?: PageHeroAction;
    secondary?: PageHeroAction;
  };
  image: PageHeroImage;
  a11y?: {
    actionsLabel?: string;
    imageCardLabel?: string;
  };
}

export interface PageHeroProps {
  texts: PageHeroContent;
  lang: 'de' | 'en' | 'es';
  classNames?: Partial<Record<HeroClassNameSlot, string>>;
}

const joinClasses = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export function PageHero({ texts, lang, classNames }: PageHeroProps) {
  const titleId = useId();
  const descriptionId = useId();
  const ctas = [texts.ctas?.primary, texts.ctas?.secondary].filter(Boolean) as PageHeroAction[];
  const hasDescriptions = texts.descriptions.length > 0;
  const actionsLabel = texts.a11y?.actionsLabel;

  return (
    <section
      className={joinClasses(styles.hero, classNames?.root)}
      aria-labelledby={titleId}
      aria-describedby={hasDescriptions ? descriptionId : undefined}
    >
      <div className={joinClasses(styles.container, classNames?.container)}>
        <div className={joinClasses(styles.heroMedia, classNames?.media)}>
          <div className={joinClasses(styles.heroMediaFrame, classNames?.mediaFrame)}>
            <Image
              className={joinClasses(styles.heroImage, classNames?.image)}
              src={texts.image.src}
              alt={texts.image.alt}
              fill
              priority={texts.image.priority ?? true}
              sizes="100vw"
            />
          </div>
        </div>

        <div className={joinClasses(styles.heroContent, classNames?.content)}>
          <header className={joinClasses(styles.heroCopy, classNames?.copy)}>
            {texts.badge && (
              <span
                className={joinClasses(
                  styles.heroBadge,
                  'badge',
                  'badge--primary',
                  classNames?.badge
                )}
              >
                {texts.badge}
              </span>
            )}

            <h1
              id={titleId}
              className={joinClasses(styles.heroTitle, 'type-display-md', classNames?.title)}
            >
              {texts.title}
            </h1>

            <div
              id={hasDescriptions ? descriptionId : undefined}
              className={joinClasses(styles.heroDescriptions, classNames?.descriptions)}
            >
              {texts.descriptions.map((description) => (
                <p
                  key={description}
                  className={joinClasses(
                    styles.heroDescription,
                    'type-body-lg',
                    classNames?.description
                  )}
                >
                  {description}
                </p>
              ))}
            </div>

            {ctas.length > 0 && (
              <nav
                className={joinClasses(styles.heroCtas, classNames?.ctas)}
                aria-label={actionsLabel}
              >
                {ctas.map((cta, index) => {
                  const isPrimary = cta.variant ? cta.variant === 'primary' : index === 0;

                  return (
                    <Link
                      key={`${cta.href}-${cta.label}`}
                      className={joinClasses(
                        isPrimary ? 'btn--primary' : 'btn--secondary',
                        'button',
                        `${styles.cta}`
                      )}
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
