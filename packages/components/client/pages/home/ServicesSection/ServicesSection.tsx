import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

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
            const titleColor = item.href.includes('house-cleaning')
              ? 'color--cleaning'
              : 'color--service';

            return (
              <article className={`${styles.card} ${cardVariant}`} key={item.title}>
                <div className={`${styles.cardIcon} ${cardVariant}`} aria-hidden="true">
                  <Image
                    className={styles.logoImage}
                    src={item.icon}
                    alt=""
                    width={40}
                    height={40}
                  />
                </div>
                <aside className={styles.cardAside}>
                  <h3 className={`${styles.cardTitle} ${titleColor}`}>{item.title}</h3>
                  <p className={styles.cardText}>{item.description}</p>
                  <Link className={`${styles.cardLink} ${titleColor}`} href={href(lang, item.href)}>
                    {item.ctaLabel}{' '}
                    <span aria-hidden="true">
                      <IoIosArrowForward />
                    </span>
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
