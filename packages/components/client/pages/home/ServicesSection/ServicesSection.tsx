import Link from 'next/link';
import styles from './ServicesSection.module.css';
import { href } from '../../../../../utils/navigation';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

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
        <header className={styles.sectionHeader}>
          <h2 id="home-services-title" className={`${styles.sectionTitle} type-title-xl`}>
            {texts.title}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>{texts.subtitle}</p>
        </header>
        <div className={styles.cardGrid}>
          {texts.items.map((item) => {
            const serviceCardClass = item.href.includes('cleaning')
              ? 'glass-panel--service-primary'
              : 'glass-panel--service-secondary';

            return (
              <article className={`${styles.card} ${serviceCardClass}`} key={item.title}>
                <div className={styles.cardIcon} aria-hidden="true">
                  <Image className={styles.icon} src={item.icon} alt="" width={40} height={40} />
                </div>
                <aside className={styles.cardAside}>
                  <h3 className={`${styles.cardTitle} type-title-sm`}>{item.title}</h3>
                  <p className={`${styles.cardText} type-body-sm`}>{item.description}</p>
                  <Link className={`${styles.cardLink} type-body-sm`} href={href(lang, item.href)}>
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
