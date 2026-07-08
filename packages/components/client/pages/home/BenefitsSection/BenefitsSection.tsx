import { LuCalendarCheck2, LuClock } from 'react-icons/lu';
import styles from './BenefitsSection.module.css';
import { AiOutlineSolution } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io';
import { resolveHomeBenefitsItems } from '../home.fallbacks';
import type { HomeBenefitsSectionTexts } from '../home.types';

export default function BenefitsSection({
  texts,
}: {
  texts?: HomeBenefitsSectionTexts;
}) {
  const itemIcons = [AiOutlineSolution, LuClock, LuCalendarCheck2, IoMdSearch];
  const items = resolveHomeBenefitsItems(texts);

  return (
    <section className={styles.benefits} aria-labelledby="home-benefits-title">
      <div className={styles.container}>
        <header className={styles.benefitsCopy}>
          <h2 id="home-benefits-title" className={`${styles.sectionTitle} type-display-md`}>
            {texts?.title ?? 'Für Kund:innen angenehm – für das Team effizient.'}
          </h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>
            {texts?.description ??
              'Havenova reduziert Hin und Her, macht Anfragen klarer und hält Abläufe sauber: weniger Missverständnisse, schnellere Angebote, bessere Planung.'}
          </p>
        </header>
        <ul className={styles.benefitsCards}>
          {items.map((item, index) => {
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
