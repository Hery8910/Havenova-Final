// src/components/FAQPreview.tsx
import styles from './FAQPreview.module.css';
import { LuPlus } from 'react-icons/lu';

export interface FAQPreviewItems {
  question: string;
  answer: string;
}

export interface FAQPreviewProps {
  items: FAQPreviewItems[];
  openIndex: number | null;
  onToggle: (index: number) => void;
}

const FAQPreview: React.FC<FAQPreviewProps> = ({ items, openIndex, onToggle }) => {
  return (
    <ul className={styles.ul}>
      {items.map((question, index) => (
        <li key={index} className={styles.li} onClick={() => onToggle(index)}>
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
  );
};

export default FAQPreview;
