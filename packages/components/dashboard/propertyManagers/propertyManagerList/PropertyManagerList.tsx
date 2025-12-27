'use client';

import { GoDotFill } from 'react-icons/go';
import { IoIosArrowForward } from 'react-icons/io';
import { PropertyManager } from '@/packages/types';
import styles from './PropertyManagerList.module.css';

interface PropertyManagerListTexts {
  emailLabel: string;
  buildingsLabel: string;
  loadingLabel: string;
  emptyLabel: string;
  detailsLabel: string;
}

interface PropertyManagerListProps {
  managers: PropertyManager[];
  loading: boolean;
  texts: PropertyManagerListTexts;
  onSelect: (id: string) => void;
}

const PropertyManagerList = ({
  managers,
  loading,
  texts,
  onSelect,
}: PropertyManagerListProps) => {
  if (loading) {
    return <div className={`${styles.emptyState} text-body-sm`}>{texts.loadingLabel}</div>;
  }

  if (managers.length === 0) {
    return <div className={`${styles.emptyState} text-body-sm`}>{texts.emptyLabel}</div>;
  }

  return (
    <ul className={styles.cards}>
      {managers.map((manager) => (
        <li
          className={`${styles.cardItem} ${
            manager.status === 'active' ? styles.cardItemActive : styles.cardItemInactive
          }`}
          key={manager.id}
          onClick={() => onSelect(manager.id)}
        >
          <header className={styles.cardHeader}>
            <aside>
              <h4 className={styles.cardTitle}>{manager.name}</h4>
              <p className={`${styles.cardSubtext} text-body-sm`}>{manager.email || '-'}</p>
            </aside>
            <span
              className={`${styles.badge} ${
                manager.status === 'active' ? styles.badgeActive : styles.badgeInactive
              }`}
            >
              {manager.status} <GoDotFill />
            </span>
          </header>
          <article className={styles.cardMeta}>
            <div className={styles.cardMetaDiv}>
              <span className={`${styles.cardLabel} text-label`}>{texts.buildingsLabel}</span>
              <span className={styles.cardValue}>{manager.buildingCount ?? 0}</span>
            </div>
            <button
              className={styles.iconButton}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(manager.id);
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

export default PropertyManagerList;
