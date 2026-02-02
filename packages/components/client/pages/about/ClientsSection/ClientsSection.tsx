import styles from './ClientsSection.module.css';

export default function ClientsSection({
  texts,
}: {
  texts: {
    title: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
    closing: string;
  };
}) {
  return (
    <section className={styles.section} aria-labelledby="about-clients-title">
      <div className={styles.container}>
        <h2 id="about-clients-title" className={styles.title}>
          {texts.title}
        </h2>
        <ul className={styles.list}>
          {texts.items.map((item, index) => (
            <li className={`${styles.item} card--glass`} key={`${item.title}-${index}`}>
              <article
                className={styles.card}
                aria-labelledby={`about-client-title-${index}`}
                aria-describedby={`about-client-description-${index}`}
              >
                <div
                  className={styles.media}
                  role="img"
                  aria-label={item.imageAlt}
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className={styles.content}>
                  <h3 id={`about-client-title-${index}`} className={styles.cardTitle}>
                    {item.title}
                  </h3>
                  <p id={`about-client-description-${index}`} className={styles.cardDescription}>
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <p id="about-clients-close-description" className={styles.closing}>
        {texts.closing}
      </p>
    </section>
  );
}
