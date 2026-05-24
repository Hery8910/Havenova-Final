'use client';
import { useId, useState } from 'react';
import styles from './FAQSection.module.css';
import { useI18n } from '../../../contexts';
import { LuPlus } from 'react-icons/lu';

export interface FAQItems {
  question: string;
  answer: string;
}

export interface FAQSectionTexts {
  title: string;
  items: FAQItems[];
  a11y?: {
    sectionLabel?: string;
    openItem?: string;
    closeItem?: string;
  };
}

export default function FAQSection() {
  const { texts } = useI18n();
  const faq: FAQSectionTexts = texts?.components?.client?.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionTitleId = useId();

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!faq) return null;

  return (
    <section
      className={styles.section}
      aria-labelledby={sectionTitleId}
      aria-label={faq.a11y?.sectionLabel}
    >
      <h2 className={`${styles.title} type-title-lg`} id={sectionTitleId}>
        {faq.title}
      </h2>
      <ul className={styles.ul}>
        {faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          const headingId = `${sectionTitleId}-heading-${index}`;
          const panelId = `${sectionTitleId}-panel-${index}`;

          return (
            <li key={item.question} className={styles.li}>
              <h3 className={styles.heading}>
                <button
                  className={`button button--ghost ${styles.trigger}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-labelledby={headingId}
                  aria-label={isOpen ? faq.a11y?.closeItem : faq.a11y?.openItem}
                  onClick={() => handleToggle(index)}
                >
                  <span className={`${styles.question} type-title-sm`} id={headingId}>
                    {item.question}
                  </span>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <LuPlus className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
                  </span>
                </button>
              </h3>
              <div
                className={styles.answerWrap}
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
              >
                <p className={`${styles.answer} type-body-md`}>{item.answer}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
