import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';
import Image from 'next/image';
import { resolveHomeServicesContent } from '../home.fallbacks';
import type { HomeServicesSectionTexts } from '../home.types';

export default function ServicesSection({
  texts,
  lang,
}: {
  texts?: HomeServicesSectionTexts;
  lang: 'de' | 'en' | 'es';
}) {
  const content = resolveHomeServicesContent(texts, lang);
  const items = content.items;

  return (
    <section className={styles.services} aria-labelledby="home-services-title">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 id="home-services-title" className={`${styles.sectionTitle} type-display-md`}>
            {content.title}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>{content.subtitle}</p>
        </header>
        <div className={styles.cardGrid}>
          {items.map((item) => {
            const serviceCardClass = item.href.includes('cleaning') ? 'primary' : 'secondary';

            return (
              <article className={`${styles.card} card card--${serviceCardClass}`} key={item.title}>
                <header className={styles.cardIcon}>
                  <h3 className={`${styles.cardTitle} type-display-sm`}>{item.title}</h3>
                  <span className={styles.iconSurface} aria-hidden="true">
                    <Image className={styles.icon} src={item.icon} alt="" width={80} height={80} />
                  </span>
                </header>
                <aside className={styles.cardAside}>
                  <p className={`${styles.cardText} type-body-sm`}>{item.description}</p>
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
