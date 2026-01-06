import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';

export function ServicesSection({
  texts,
  lang,
}: {
  texts: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      ctaLabel: string;
      href: string;
      icon: string;
    }[];
  };
  lang: 'de' | 'en';
}) {
  return (
    <section className={styles.services} aria-labelledby="home-services-title">
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 id="home-services-title" className={styles.sectionTitle}>
            {texts.title}
          </h2>
          <p className={styles.sectionSubtitle}>{texts.subtitle}</p>
        </div>
        <div className={styles.cardGrid}>
          {texts.items.map((item) => {
            const cardVariant = item.href.includes('house-cleaning')
              ? 'card--cleaning'
              : 'card--service';

            return (
              <article className={`${styles.card} ${cardVariant}`} key={item.title}>
                <div className={styles.cardIcon} aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.description}</p>
                <Link className={styles.cardLink} href={href(lang, item.href)}>
                  {item.ctaLabel} <span aria-hidden="true">→</span>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
