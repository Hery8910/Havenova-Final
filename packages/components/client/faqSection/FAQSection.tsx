'use client';
import { useState } from 'react';
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
}

export interface FAQSectionTexts {}

export default function FAQSection() {
  const { texts } = useI18n();
  const faq: FAQSectionTexts = texts?.components?.client?.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!faq) return null;

  return (
    <section className={styles.section}>
      <h2>{faq.title}</h2>
      <ul className={styles.ul}>
        {faq.items.map((question, index) => (
          <li key={index} className={styles.li} onClick={() => handleToggle(index)}>
            <h4 className={styles.h4}>
              {question.question}
              <span>
                <LuPlus className={`${styles.icon} ${openIndex === index ? styles.open : ''}`} />
              </span>
            </h4>
            {openIndex === index && <p className={styles.p}>{question.answer}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
