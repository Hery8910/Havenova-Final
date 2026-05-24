import { useId } from 'react';
import Image from 'next/image';
import styles from './ClientsSection.module.css';

export default function ClientsSection({
  texts,
}: {
  texts: {
    title: string;
    description: string;
    a11y?: {
      sectionLabel?: string;
      listLabel?: string;
    };
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
    closing: string;
  };
}) {
  const titleId = useId();
  const descriptionId = useId();
  const closingId = useId();

  return (
    <section
      className={styles.section}
      aria-labelledby={titleId}
      aria-describedby={`${descriptionId} ${closingId}`}
      aria-label={texts.a11y?.sectionLabel}
    >
      <div className={styles.container}>
        <h2 id={titleId} className={`${styles.title} type-title-lg`}>
          {texts.title}
        </h2>
        <p id={descriptionId} className={`${styles.description} type-body-md`}>
          {texts.description}
        </p>
        <ul className={styles.list} aria-label={texts.a11y?.listLabel}>
          {texts.items.map((item, index) => (
            <li className={styles.item} key={`${item.title}-${index}`}>
              <article
                className={styles.card}
                aria-labelledby={`about-client-title-${index}`}
                aria-describedby={`about-client-description-${index}`}
              >
                <Image
                  className={styles.media}
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 440px) 300px, (max-width: 900px) 350px, 350px"
                />
                <div className={styles.content}>
                  <h3 id={`about-client-title-${index}`} className={`${styles.cardTitle} type-title-sm`}>
                    {item.title}
                  </h3>
                  <p
                    id={`about-client-description-${index}`}
                    className={`${styles.cardDescription} type-body-sm`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <p id={closingId} className={`${styles.closing} type-body-md`}>
        {texts.closing}
      </p>
    </section>
  );
}
