// src/components/FAQPreview.tsx
import styles from './FAQPreview.module.css';
import { LuPlus } from 'react-icons/lu';
import Link from 'next/link';
import { CTAItem, FAQPreviewItems } from './FAQPreviewWrapper';
import Button, { ButtonProps } from '../button/Button';

export interface FAQPreviewProps {
  title: string;
  items: FAQPreviewItems[];
  cta: CTAItem;
  button: ButtonProps;
  onClick: () => void;
  openIndex: number | null;
  onToggle: (index: number) => void;
}

const FAQPreview: React.FC<FAQPreviewProps> = ({
  title,
  items,
  cta,
  button,
  onClick,
  openIndex,
  onToggle,
}) => {
  return (
    <section className={styles.section}>
      <header>
        <h2>{title}</h2>
      </header>
      <ul className={styles.ul}>
        {items.map((question, index) => (
          <li key={index} className={styles.li} onClick={() => onToggle(index)}>
            <h4 className={styles.h4}>
              {question.question}
              <LuPlus className={`${styles.icon} ${openIndex === index ? styles.open : ''}`} />
            </h4>
            {openIndex === index && <p className={styles.p}>{question.answer}</p>}
          </li>
        ))}
      </ul>
      <aside className={styles.aside}>
        <h2>{cta.title}</h2>
        <h4 className={styles.description}>{cta.description}</h4>
        <Button cta={button.cta} variant={button.variant} icon={button.icon} onClick={onClick} />
      </aside>
    </section>
  );
};

export default FAQPreview;
