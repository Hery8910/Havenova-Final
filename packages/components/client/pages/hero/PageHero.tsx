import { useId } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoLocationOutline } from 'react-icons/io5';
import styles from './PageHero.module.css';
import { href } from '../../../../utils';

type HeroClassNameSlot =
  | 'root'
  | 'pattern'
  | 'container'
  | 'grid'
  | 'copy'
  | 'badge'
  | 'title'
  | 'titleAccent'
  | 'titleSuffix'
  | 'descriptions'
  | 'description'
  | 'ctas'
  | 'imageWrap'
  | 'imageFrame'
  | 'image'
  | 'imageCard';

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
  titleAccent?: string;
  titleSuffix?: string;
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
  lang: 'de' | 'en';
  classNames?: Partial<Record<HeroClassNameSlot, string>>;
}

const joinClasses = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

export function PageHero({ texts, lang, classNames }: PageHeroProps) {
  const titleId = useId();
  const ctas = [texts.ctas?.primary, texts.ctas?.secondary].filter(Boolean) as PageHeroAction[];

  return (
    <section className={joinClasses(styles.hero, classNames?.root)} aria-labelledby={titleId}>
      <span className={joinClasses(styles.heroPattern, classNames?.pattern)} aria-hidden="true" />

      <div className={joinClasses(styles.container, classNames?.container)}>
        <div className={joinClasses(styles.heroGrid, classNames?.grid)}>
          <header className={joinClasses(styles.heroCopy, classNames?.copy)}>
            {texts.badge && (
              <span className={joinClasses(styles.heroBadge, 'type-label', classNames?.badge)}>
                {texts.badge}
              </span>
            )}

            <h1
              id={titleId}
              className={joinClasses(styles.heroTitle, 'type-display-md', classNames?.title)}
            >
              {texts.title}
              {texts.titleAccent && (
                <>
                  {' '}
                  <span className={joinClasses(styles.heroTitleAccent, classNames?.titleAccent)}>
                    {texts.titleAccent}
                  </span>
                </>
              )}
              {texts.titleSuffix && (
                <>
                  {' '}
                  <span className={joinClasses(styles.heroTitleSuffix, classNames?.titleSuffix)}>
                    {texts.titleSuffix}
                  </span>
                </>
              )}
            </h1>

            <div className={joinClasses(styles.heroDescriptions, classNames?.descriptions)}>
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
                aria-label={texts.a11y?.actionsLabel}
              >
                {ctas.map((cta, index) => {
                  const isPrimary = cta.variant ? cta.variant === 'primary' : index === 0;

                  return (
                    <Link
                      key={`${cta.href}-${cta.label}`}
                      className={joinClasses(
                        isPrimary ? styles.ctaPrimary : styles.ctaSecondary,
                        'button',
                        cta.className
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

          <figure className={joinClasses(styles.heroImageWrap, classNames?.imageWrap)}>
            <div className={joinClasses(styles.heroImageFrame, classNames?.imageFrame)}>
              <Image
                className={joinClasses(styles.heroImage, classNames?.image)}
                src={texts.image.src}
                alt={texts.image.alt}
                fill
                priority={texts.image.priority ?? true}
                sizes="(max-width: 1024px) 0px, 50vw"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
