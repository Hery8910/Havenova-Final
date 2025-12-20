'use client';

import styles from './page.module.css';
import type { PropertyManagerDetail } from '@/packages/types/propertyManager';

interface PropertyManagerDetailsTexts {
  title: string;
  emptyState: string;
  loading: string;
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
  loading: boolean;
  texts: PropertyManagerDetailsTexts;
}

const PropertyManagerDetails = ({ manager, loading, texts }: PropertyManagerDetailsProps) => {

  if (loading) {
    return <div className={styles.placeholder}>{texts.loading}</div>;
  }

  if (!manager) {
    return <div className={styles.placeholder}>{texts.emptyState}</div>;
  }

  return (
    <div className={styles.details}>
      <div className={styles.detailsHeader}>
        <div>
          <span className={styles.detailsLabel}>{texts.title}</span>
          <h2 className={styles.detailsTitle}>{manager.name}</h2>
          <p className={styles.detailsSubtitle}>{manager.email || '-'}</p>
        </div>
        <span
          className={`${styles.badge} ${
            manager.status === 'active' ? styles.badgeActive : styles.badgeInactive
          }`}
        >
          {manager.status}
        </span>
      </div>
      <div className={styles.detailsGrid}>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.phone}</span>
          <span className={styles.detailsMetaValue}>{manager.phone || '-'}</span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.address}</span>
          <span className={styles.detailsMetaValue}>{manager.address || '-'}</span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.preferredContact}</span>
          <span className={styles.detailsMetaValue}>
            {manager.preferredContactMethod || '-'}
          </span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.createdAt}</span>
          <span className={styles.detailsMetaValue}>{manager.createdAt || '-'}</span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.updatedAt}</span>
          <span className={styles.detailsMetaValue}>{manager.updatedAt || '-'}</span>
        </div>
      </div>
      <div className={styles.detailsSection}>
        <span className={styles.detailsMetaLabel}>{texts.notes}</span>
        <p className={styles.detailsNote}>{manager.notes || '-'}</p>
      </div>
      <div className={styles.detailsCounts}>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.totalBuildings}</span>
          <span className={styles.detailsMetaValue}>{manager.buildingCounts.total}</span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.activeBuildings}</span>
          <span className={styles.detailsMetaValue}>{manager.buildingCounts.active}</span>
        </div>
        <div>
          <span className={styles.detailsMetaLabel}>{texts.inactiveBuildings}</span>
          <span className={styles.detailsMetaValue}>{manager.buildingCounts.inactive}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyManagerDetails;
