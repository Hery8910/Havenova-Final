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
  preferredCleaningDay: string;
  preferredCleaningWindowDay: string;
  cleaningSuppliesRoom?: string;
  keyAccess?: string;
  waterAccess?: string;
  waterDisposal?: string;
  ladderAvailable?: string;
  electricityAccess?: string;
  lightBulbChangeRequired?: string;
  flooringType?: string;
  onSiteContact?: string;
  decisionMaker?: string;
  cleaningInfo?: string;
  status: string;
  notes?: string;
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
          <p className={styles.detailsP}>{object.propertyManagerName || '-'}</p>
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
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.entrancesCount}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.entrancesCount || '-'}</p>
        </li>
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.floorCount}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.floorCount || '-'}</p>
        </li>
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.preferredCleaningDay}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{object.preferredCleaningDay || '-'}</p>
        </li>
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.preferredCleaningWindowDay}</p>
          <p className={`${styles.detailsP} text-body-sm`}>
            {object.preferredCleaningWindowDay || '-'}
          </p>
        </li>
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.createdAt}</p>
          {object.createdAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(object.createdAt)}
            </p>
          )}
        </li>
        <li className={styles.detailsLi}>
          <p className="text-label">{texts.updatedAt}</p>
          {object.updatedAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(object.updatedAt)}
            </p>
          )}
        </li>
      </ul>
      <ul className={styles.notesList}>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.onSiteContact}</p>
          <p className="text-body-sm">{object.onSiteContact || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.decisionMaker}</p>
          <p className="text-body-sm">{object.decisionMaker || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.cleaningSuppliesRoom}</p>
          <p className="text-body-sm">{object.cleaningSuppliesRoom || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.keyAccess}</p>
          <p className="text-body-sm">{object.keyAccess || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.waterAccess}</p>
          <p className="text-body-sm">{object.waterAccess || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.waterDisposal}</p>
          <p className="text-body-sm">{object.waterDisposal || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.ladderAvailable}</p>
          <p className="text-body-sm">{object.ladderAvailable || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.electricityAccess}</p>
          <p className="text-body-sm">{object.electricityAccess || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.lightBulbChangeRequired}</p>
          <p className="text-body-sm">{object.lightBulbChangeRequired || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.flooringType}</p>
          <p className="text-body-sm">{object.flooringType || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.cleaningInfo}</p>
          <p className="text-body-sm">{object.cleaningInfo || '-'}</p>
        </li>
        <li className={styles.notesLi}>
          <p className={`${styles.notesLabel} text-label`}>{texts.notes}</p>
          <p className="text-body-sm">{object.notes || '-'}</p>
        </li>
      </ul>
    </section>
  );
};

export default ObjectDetails;
