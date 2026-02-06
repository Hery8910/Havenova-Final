import styles from './BenefitsSection.module.css';

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
  return (
    <section className={styles.benefits} aria-labelledby="home-benefits-title">
      <div className={styles.container}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitsCopy}>
            <span className={styles.kicker}>{texts.kicker}</span>
            <h2 id="home-benefits-title" className={styles.sectionTitle}>
              {texts.title}
            </h2>
            <p className={styles.sectionSubtitle}>{texts.description}</p>
          </div>
          <ul className={styles.benefitsCards}>
            {texts.items.map((item) => (
              <li className={styles.benefitItem} key={item.title}>
                <article className={`${styles.benefitCard} card`}>
                  <h3 className={styles.benefitTitle}>{item.title}</h3>
                  <p className={styles.benefitText}>{item.description}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
