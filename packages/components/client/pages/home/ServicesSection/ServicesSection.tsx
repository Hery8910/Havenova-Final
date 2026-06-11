import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';
import Image from 'next/image';
import { resolveHomeServicesItems } from '../home.fallbacks';
import type { HomeServicesSectionTexts } from '../home.types';

export default function ServicesSection({
  texts,
  lang,
}: {
  texts?: HomeServicesSectionTexts;
  lang: 'de' | 'en' | 'es';
}) {
  const items = resolveHomeServicesItems(texts);

  return (
    <section className={styles.services} aria-labelledby="home-services-title">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 id="home-services-title" className={`${styles.sectionTitle} type-title-xl v2-page-heading`}>
            {texts?.title ?? 'Unsere Services'}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg v2-page-copy`}>
            {texts?.subtitle ??
              'Zwei klare Wege – wähle den passenden Service und sende deine Anfrage in wenigen Minuten.'}
          </p>
        </header>
        <div className={styles.cardGrid}>
          {items.map((item) => {
            const serviceCardClass = item.href.includes('cleaning') ? 'primary' : 'secondary';

            return (
              <article className={`${styles.card} v2-card v2-card--${serviceCardClass}`} key={item.title}>
                <header className={styles.cardIcon}>
                  <h3 className={`${styles.cardTitle} type-title-md v2-page-heading`}>{item.title}</h3>
                  <span className={`${styles.iconSurface} v2-card v2-card--neutral`} aria-hidden="true">
                    <Image className={styles.icon} src={item.icon} alt="" width={80} height={80} />
                  </span>
                </header>
                <aside className={styles.cardAside}>
                  <p className={`${styles.cardText} type-body-sm v2-page-copy`}>{item.description}</p>
                  <ul className={styles.serviceList}>
                    {item.highlights.map((highlight) => (
                      <li className={`${styles.serviceListItem} type-body-sm`} key={highlight}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className={`${styles.cardLink} v2-button v2-button--${serviceCardClass}`}
                    href={href(lang, item.href)}
                  >
                    {item.ctaLabel}
                  </Link>
                </aside>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
