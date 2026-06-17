'use client';
import { useId, useState } from 'react';
import styles from './FAQSection.module.css';
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

const FAQ_ITEMS_FALLBACK: FAQItems[] = [
  {
    question: 'Welche Dienstleistungen bietet Havenova an?',
    answer:
      'Havenova bietet Unterstuetzung fuer Reinigung und Hausservice, damit Anfragen klar strukturiert und passend bearbeitet werden koennen.',
  },
  {
    question: 'Wie laeuft eine Anfrage ab?',
    answer:
      'Sie senden Ihre Anfrage mit den wichtigsten Angaben. Danach prueft unser Team den Bedarf und meldet sich mit den naechsten Schritten.',
  },
];

interface FAQSectionProps {
  texts: FAQSectionTexts;
}

function resolveFaqTexts(texts: FAQSectionTexts | undefined): FAQSectionTexts {
  return {
    title: texts?.title ?? 'Haeufig gestellte Fragen',
    items: texts?.items?.length ? texts.items : FAQ_ITEMS_FALLBACK,
    a11y: {
      sectionLabel: texts?.a11y?.sectionLabel ?? 'Haeufig gestellte Fragen',
      openItem: texts?.a11y?.openItem ?? 'Antwort oeffnen',
      closeItem: texts?.a11y?.closeItem ?? 'Antwort schliessen',
    },
  };
}

export default function FAQSection({ texts: providedTexts }: FAQSectionProps) {
  const faq = resolveFaqTexts(providedTexts);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionTitleId = useId();

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={styles.section}
      aria-labelledby={sectionTitleId}
      aria-label={faq.a11y?.sectionLabel}
    >
      <h2 className={`${styles.title} type-display-md`} id={sectionTitleId}>
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
