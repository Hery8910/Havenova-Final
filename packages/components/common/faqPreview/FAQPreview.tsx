'use client';
import styles from './FAQPreview.module.css';
import { useI18n } from '../../../contexts/I18nContext';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import Link from 'next/link';

interface FAQPreviewItem {
  question: string;
  answer: string;
}

interface FAQPreviewProps {
  title: string;
  items: FAQPreviewItem[];
  cta: {
    label: string;
    href: string;
    title: string;
    description: string;
  };
}
const FAQPreview: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpen((prev) => (prev === index ? null : index));
  };
  const { texts } = useI18n();
  const faq: FAQPreviewProps | undefined = texts?.pages?.home?.faq;

  if (!faq) {
    return (
      <section className={styles.section}>
        <div
          className={styles.skeleton}
          style={{ width: '100%', height: 504, background: '#eee' }}
        />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <header>
        <h2>{faq.title}</h2>
      </header>
      <ul className={styles.ul}>
        {faq.items.map((question, index) => (
          <li key={index} className={styles.li} onClick={() => handleClick(index)}>
            <h4 className={styles.h4}>
              {question.question}
              <LuPlus className={`${styles.icon} ${open === index ? styles.open : ''}`} />
            </h4>
            {open === index && <p className={styles.p}>{question.answer}</p>}
          </li>
        ))}
      </ul>
      <aside className={styles.aside}>
        <h2>{faq.cta.title}</h2>
        <h4 className={styles.description}>{faq.cta.description}</h4>
        <Link href={faq.cta.href} className="button">
          {faq.cta.label}
        </Link>
      </aside>
    </section>
  );
};

export default FAQPreview;
