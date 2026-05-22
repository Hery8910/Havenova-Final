import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';
import Image from 'next/image';

export default function ServicesSection({
  texts,
  lang,
}: {
  texts: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      highlights: string[];
      ctaLabel: string;
      href: string;
      icon: string;
    }[];
  };
  lang: 'de' | 'en' | 'es';
}) {
  return (
    <section className={styles.services} aria-labelledby="home-services-title">
      <div className={styles.container}>
        <header className={styles.sectionHeader}>
          <h2 id="home-services-title" className={`${styles.sectionTitle} type-title-xl`}>
            {texts.title}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>{texts.subtitle}</p>
        </header>
        <div className={styles.cardGrid}>
          {texts.items.map((item) => {
            const serviceCardClass = item.href.includes('cleaning') ? 'primary' : 'secondary';

            return (
              <article className={`${styles.card} card card--${serviceCardClass}`} key={item.title}>
                <div className={styles.cardIcon} aria-hidden="true">
                  <h3 className={`${styles.cardTitle} type-title-md`}>{item.title}</h3>
                  <Image
                    className={` card card--neutral ${styles.icon}`}
                    src={item.icon}
                    alt=""
                    width={80}
                    height={80}
                  />
                </div>
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
                    className={`${styles.cardLink} button button--${serviceCardClass}`}
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
