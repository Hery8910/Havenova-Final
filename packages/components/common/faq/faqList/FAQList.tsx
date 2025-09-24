'use client';
import { useState } from 'react';
import styles from './FAQList.module.css';
import { FAQPreview } from '../faqPreview';

import { LuFileQuestion } from 'react-icons/lu';
import { MdOutlineHomeRepairService } from 'react-icons/md';
import { MdOutlinePayments } from 'react-icons/md';
import { AiOutlineSafety } from 'react-icons/ai';
import FAQListSkeleton from './FAQList.skeleton';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  items: FAQItem[];
}

export interface FAQPageProps {
  categories: FAQCategory[];
}

const FAQPage: React.FC<FAQPageProps> = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0); // index of current category
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <LuFileQuestion />;
      case 1:
        return <MdOutlineHomeRepairService />;
      case 2:
        return <MdOutlinePayments />;
      case 3:
        return <AiOutlineSafety />;
      default:
        return <LuFileQuestion />; // fallback
    }
  };

  if (!categories) return <FAQListSkeleton />;
  return (
    <section className={styles.section} role="region" aria-labelledby="faq-headline">
      <nav className={styles.nav} aria-label="FAQ categories">
        <ul className={styles.navList}>
          {categories.map((cat, idx) => (
            <li className={styles.navLi} key={idx}>
              <button
                className={`${styles.navButton} ${activeCategory === idx ? styles.active : ''}`}
                onClick={() => {
                  setActiveCategory(idx);
                  setOpenIndex(null); // reset open FAQ
                }}
              >
                <span className={styles.icon}>{getCategoryIcon(idx)}</span>
                {cat.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <aside className={styles.aside}>
        <h3 className={styles.h3}>
          <span className={styles.icon}>{getCategoryIcon(activeCategory)}</span>{' '}
          {categories[activeCategory].title}
        </h3>
        <FAQPreview
          items={categories[activeCategory].items}
          openIndex={openIndex}
          onToggle={handleToggle}
        />
      </aside>
    </section>
  );
};

export default FAQPage;
