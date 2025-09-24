'use client';
import { useState } from 'react';
import FAQPreview from '../faqPreview/FAQPreview';
import Button, { ButtonProps } from '../../button/Button';
import styles from './FAQSection.module.css';
import { FAQSectionSkeleton } from '.';

export interface FAQSectionItems {
  question: string;
  answer: string;
}
export interface CTAItem {
  title: string;
  description: string;
}

export interface FAQSectionProps {
  title: string;
  items: FAQSectionItems[];
  cta: CTAItem;
  button: ButtonProps;
  image: string;
  onClick: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, items, cta, button, onClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (!title || !items) {
    return <FAQSectionSkeleton />;
  }

  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <FAQPreview items={items} openIndex={openIndex} onToggle={handleToggle} />
      <aside className={styles.aside}>
        <h3>{cta.title}</h3>
        <p className={styles.description}>{cta.description}</p>
        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </aside>
    </section>
  );
};

export default FAQSection;
