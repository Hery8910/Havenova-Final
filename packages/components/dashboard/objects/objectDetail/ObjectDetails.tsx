'use client';

import { FiEdit2 } from 'react-icons/fi';
import styles from './ObjectDetails.module.css';
import { BuildingDetail } from '@/packages/types/object';
import { formatMessageAge } from '../../../../utils';

interface ObjectDetailsTexts {
  title: string;
  emptyState: string;
  loading: string;
  editLabel?: string;
  objectNumber: string;
  address: string;
  propertyManager: string;
  entrancesCount: string;
  floorCount: string;
  preferredCleaningWindowDay: string;
  fixedCleaningDayRequired: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface ObjectDetailsProps {
  object: BuildingDetail | null;
  texts: ObjectDetailsTexts;
  loading?: boolean;
  onEdit: (object: BuildingDetail) => void;
}

const ObjectDetails = ({ object, texts, loading = false, onEdit }: ObjectDetailsProps) => {
  if (loading) {
    return (
      <section className={styles.detailsSection}>
        <p className="text-label">{texts.title}</p>
        <p className={`${styles.emptyP} text-body-sm`}>{texts.loading}</p>
      </section>
    );
  }

  if (!object) {
    return (
      <section className={styles.detailsSection}>
        <p className="text-label">{texts.title}</p>
        <p className={`${styles.emptyP} text-body-sm`}>{texts.emptyState}</p>
      </section>
    );
  }

  return (
    <section className={styles.detailsSection}>
      <aside className={styles.aside}>
        <span className="text-label">{texts.title}</span>
        <button className={styles.editButton} type="button" onClick={() => onEdit(object)}>
          <FiEdit2 aria-hidden="true" />
          {texts.editLabel || 'Edit'}
        </button>
      </aside>
      <header className={styles.detailsHeader}>
        <div>
          <h2 className={styles.detailsTitle}>{object.objectNumber}</h2>
          <p className={styles.detailsSubtitle}>{object.address || '-'}</p>
        </div>
        <div className={styles.headerActions}>
          <span
            className={`${styles.badge} ${
              object.status === 'active' ? styles.badgeActive : styles.badgeInactive
            }`}
          >
            {object.status}
          </span>
        </div>
      </header>
      <ul className={styles.detailsList}>
        <li className={styles.li}>
          <p className="text-label">{texts.propertyManager}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.propertyManagerName || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.address}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.address || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.entrancesCount}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.entrancesCount || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.floorCount}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.floorCount || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.preferredCleaningWindowDay}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.preferredCleaningDay || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.fixedCleaningDayRequired}</p>
          <p className={`${styles.detailsP} text-body-sm`}>
            {object.preferredCleaningWindowDay || '-'}
          </p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.createdAt}</p>
          {object.createdAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(object.createdAt)}
            </p>
          )}
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.updatedAt}</p>
          {object.updatedAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(object.updatedAt)}
            </p>
          )}
        </li>
      </ul>
      <article className={styles.detailsNoteSection}>
        <p className="text-label">{texts.notes}</p>
        <p className="text-body-sm">{object.notes || '-'}</p>
      </article>
    </section>
  );
};

export default ObjectDetails;
