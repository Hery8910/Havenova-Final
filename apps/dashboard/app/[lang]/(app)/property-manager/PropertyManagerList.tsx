'use client';

import styles from './page.module.css';
import type { PropertyManager } from '@/packages/types/propertyManager';
import { FiCheckCircle, FiEdit2, FiSlash } from 'react-icons/fi';

interface PropertyManagerListTexts {
  emailLabel: string;
  buildingsLabel: string;
  loadingLabel: string;
  emptyLabel: string;
  editLabel: string;
  activateLabel: string;
  deactivateLabel: string;
}

interface PropertyManagerListProps {
  managers: PropertyManager[];
  loading: boolean;
  texts: PropertyManagerListTexts;
  onSelect: (id: string) => void;
  onEdit: (manager: PropertyManager) => void;
  onToggleStatus: (manager: PropertyManager) => void;
}

const PropertyManagerList = ({
  managers,
  loading,
  texts,
  onSelect,
  onEdit,
  onToggleStatus,
}: PropertyManagerListProps) => {
  if (loading) {
    return <div className={styles.emptyState}>{texts.loadingLabel}</div>;
  }

  if (managers.length === 0) {
    return <div className={styles.emptyState}>{texts.emptyLabel}</div>;
  }

  return (
    <div className={styles.cards}>
      {managers.map((manager) => (
        <article
          className={styles.cardItem}
          key={manager.id}
          onClick={() => onSelect(manager.id)}
        >
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardTitle}>{manager.name}</h3>
              <p className={styles.cardSubtext}>
                {texts.emailLabel}: {manager.email || '-'}
              </p>
            </div>
            <span
              className={`${styles.badge} ${
                manager.status === 'active' ? styles.badgeActive : styles.badgeInactive
              }`}
            >
              {manager.status}
            </span>
          </div>
          <div className={styles.cardMeta}>
            <div>
              <span className={styles.cardLabel}>{texts.buildingsLabel}</span>
              <span className={styles.cardValue}>{manager.buildingCount ?? 0}</span>
            </div>
          </div>
          <div className={styles.actionGroup}>
            <button
              className={styles.iconButton}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(manager);
              }}
            >
              <FiEdit2 />
              {texts.editLabel}
            </button>
            <button
              className={styles.toggleButton}
              onClick={(event) => {
                event.stopPropagation();
                onToggleStatus(manager);
              }}
            >
              {manager.status === 'active' ? (
                <>
                  <FiSlash />
                  {texts.deactivateLabel}
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  {texts.activateLabel}
                </>
              )}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PropertyManagerList;
