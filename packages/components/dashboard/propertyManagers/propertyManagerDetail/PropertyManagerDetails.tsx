'use client';

import { FiEdit2 } from 'react-icons/fi';
import { PropertyManagerDetail } from '@/packages/types';
import styles from './PropertyManagerDetails.module.css';
import { formatMessageAge } from '../../../../utils';

interface PropertyManagerDetailsTexts {
  buildings: string;
  title: string;
  emptyState: string;
  loading: string;
  editLabel?: string;
  contactOptions?: {
    email?: string;
    phone?: string;
    none?: string;
  };
  phone: string;
  address: string;
  preferredContact: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  totalBuildings: string;
  activeBuildings: string;
  inactiveBuildings: string;
}

interface PropertyManagerDetailsProps {
  manager: PropertyManagerDetail | null;
  texts: PropertyManagerDetailsTexts;
  onEdit: (manager: PropertyManagerDetail) => void;
}

const PropertyManagerDetails = ({ manager, texts, onEdit }: PropertyManagerDetailsProps) => {
  if (!manager) {
    return (
      <section className={styles.detailsSection}>
        <p className={styles.detailsLabel}>{texts.title}</p>
        <p className={styles.emptyP}>{texts.emptyState}</p>
      </section>
    );
  }

  return (
    <section className={styles.detailsSection}>
      <aside className={styles.aside}>
        <span className={styles.detailsLabel}>{texts.title}</span>
        <button className={styles.editButton} type="button" onClick={() => onEdit(manager)}>
          <FiEdit2 aria-hidden="true" />
          {texts.editLabel || 'Edit'}
        </button>
      </aside>
      <header className={styles.detailsHeader}>
        <div>
          <h2 className={styles.detailsTitle}>{manager.name}</h2>
          <p className={styles.detailsSubtitle}>{manager.email || '-'}</p>
        </div>
        <div className={styles.headerActions}>
          <span
            className={`${styles.badge} ${
              manager.status === 'active' ? styles.badgeActive : styles.badgeInactive
            }`}
          >
            {manager.status}
          </span>
        </div>
      </header>
      <ul className={styles.detailsList}>
        <li className={styles.li}>
          <p className={styles.p}>{texts.phone}</p>
          <p className={styles.detailsP}>{manager.phone || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className={styles.p}>{texts.address}</p>
          <p className={styles.detailsP}>{manager.address || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className={styles.p}>{texts.preferredContact}</p>
          <p className={styles.detailsP}>
            {manager.preferredContactMethod
              ? texts.contactOptions?.[manager.preferredContactMethod] ||
                manager.preferredContactMethod
              : '-'}
          </p>
        </li>
        <li className={styles.li}>
          <p className={styles.p}>{texts.createdAt}</p>
          {manager.createdAt && (
            <p className={styles.detailsP}>{formatMessageAge(manager.createdAt)}</p>
          )}
        </li>
        <li className={styles.li}>
          <p className={styles.p}>{texts.updatedAt}</p>
          {manager.updatedAt && (
            <p className={styles.detailsP}>{formatMessageAge(manager.updatedAt)}</p>
          )}
        </li>
      </ul>
      <article className={styles.detailsNoteSection}>
        <p className={styles.p}>{texts.notes}</p>
        <p className={styles.detailsNote}>{manager.notes || '-'}</p>
      </article>

      <p className={styles.countHeading}>{texts.buildings}</p>

      <ul className={styles.detailsCounts}>
        <li className={styles.countLi}>
          <p className={styles.countTitle}>{texts.totalBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.total}</p>
        </li>
        <li className={styles.countLi}>
          <p className={styles.countTitle}>{texts.activeBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.active}</p>
        </li>
        <li className={styles.countLi}>
          <p className={styles.countTitle}>{texts.inactiveBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.inactive}</p>
        </li>
      </ul>
    </section>
  );
};

export default PropertyManagerDetails;
