import { LuCalendarCheck2, LuClock } from 'react-icons/lu';
import styles from './BenefitsSection.module.css';
import { AiOutlineSolution } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io';

export default function BenefitsSection({
  texts,
}: {
  texts: {
    kicker: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
}) {
  const itemIcons = [AiOutlineSolution, LuClock, LuCalendarCheck2, IoMdSearch];

  return (
    <section className={styles.benefits} aria-labelledby="home-benefits-title">
      <div className={styles.container}>
        <header className={styles.benefitsCopy}>
          <h2 id="home-benefits-title" className={`${styles.sectionTitle} type-display-md`}>
            {texts.title}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>{texts.description}</p>
        </header>
        <ul className={styles.benefitsCards}>
          {texts.items.map((item, index) => {
            const Icon = itemIcons[index];

            return (
              <li className={styles.benefitItem} key={item.title}>
                <article className={styles.benefitCard}>
                  {Icon ? (
                    <span className={`${styles.benefitIcon} type-title-lg`} aria-hidden="true">
                      <Icon />
                    </span>
                  ) : null}
                  <div className={styles.benefitHeading}>
                    <h3 className={`${styles.benefitTitle} type-title-sm`}>{item.title}</h3>
                    <p className={`${styles.benefitText} type-body-sm`}>{item.description}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
