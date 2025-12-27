'use client';

import { GoDotFill } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './ObjectList.module.css';
import { BuildingListItem } from '@/packages/types/object';

interface ObjectListTexts {
  propertyManagerLabel: string;
  entrancesLabel: string;
  loadingLabel: string;
  emptyLabel: string;
  detailsLabel: string;
}

interface ObjectListProps {
  objects: BuildingListItem[];
  loading: boolean;
  texts: ObjectListTexts;
  onSelect: (id: string) => void;
}

const ObjectList = ({ objects, loading, texts, onSelect }: ObjectListProps) => {
  if (loading) {
    return <div className={`${styles.emptyState} text-body-sm`}>{texts.loadingLabel}</div>;
  }

  if (objects.length === 0) {
    return <div className={`${styles.emptyState} text-body-sm`}>{texts.emptyLabel}</div>;
  }

  return (
    <ul className={styles.cards}>
      {objects.map((item) => (
        <li
          className={`${styles.cardItem} ${
            item.status === 'active' ? styles.cardItemActive : styles.cardItemInactive
          }`}
          key={item.id}
          onClick={() => onSelect(item.id)}
        >
          <header className={styles.cardHeader}>
            <aside>
              <h4 className={styles.cardTitle}>{item.objectNumber}</h4>
              <p className={`${styles.cardSubtext} text-body-sm`}>{item.address || '-'}</p>
            </aside>
            <span
              className={`${styles.badge} ${
                item.status === 'active' ? styles.badgeActive : styles.badgeInactive
              }`}
            >
              {item.status} <GoDotFill />
            </span>
          </header>
          <article className={styles.cardMeta}>
            <div className={styles.cardMetaDiv}>
              <span className={`${styles.cardLabel} text-label`}>{texts.propertyManagerLabel}</span>
              <span className={styles.cardValue}>{item.propertyManagerName || '-'}</span>
            </div>
            <div className={styles.cardMetaDiv}>
              <span className={`${styles.cardLabel} text-label`}>{texts.entrancesLabel}</span>
              <span className={styles.cardValue}>{item.entrancesCount ?? '-'}</span>
            </div>
            <button
              className={styles.iconButton}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(item.id);
              }}
            >
              {texts.detailsLabel} <IoIosArrowForward />
            </button>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default ObjectList;
