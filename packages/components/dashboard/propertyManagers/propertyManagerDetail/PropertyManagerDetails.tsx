'use client';

import { FiEdit2 } from 'react-icons/fi';
import { PropertyManagerDetail } from '@/packages/types';
import styles from './PropertyManagerDetails.module.css';
import { formatMessageAge } from '../../../../utils';
import { useI18n } from '../../../../contexts/i18n/I18nContext';

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
  loading?: boolean;
  onEdit: (manager: PropertyManagerDetail) => void;
}

const PropertyManagerDetails = ({
  manager,
  texts,
  loading = false,
  onEdit,
}: PropertyManagerDetailsProps) => {
  const { texts: i18nTexts, language } = useI18n();
  const relativeTime = i18nTexts.date?.relative;

  if (loading) {
    return (
      <section className={styles.detailsSection}>
        <p className="text-label">{texts.title}</p>
        <p className={`${styles.emptyP} text-body-sm`}>{texts.loading}</p>
      </section>
    );
  }

  if (!manager) {
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
          <p className="text-label">{texts.phone}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{manager.phone || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.address}</p>
          <p className={`${styles.detailsP} text-body-sm`}>{manager.address || '-'}</p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.preferredContact}</p>
          <p className={`${styles.detailsP} text-body-sm`}>
            {manager.preferredContactMethod
              ? (texts.contactOptions?.[
                  manager.preferredContactMethod as keyof NonNullable<
                    PropertyManagerDetailsTexts['contactOptions']
                  >
                ] ?? manager.preferredContactMethod)
              : '-'}
          </p>
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.createdAt}</p>
          {manager.createdAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(manager.createdAt, { relativeTime, locale: language })}
            </p>
          )}
        </li>
        <li className={styles.li}>
          <p className="text-label">{texts.updatedAt}</p>
          {manager.updatedAt && (
            <p className={`${styles.detailsP} text-body-sm`}>
              {formatMessageAge(manager.updatedAt, { relativeTime, locale: language })}
            </p>
          )}
        </li>
      </ul>
      <article className={styles.detailsNoteSection}>
        <p className="text-label">{texts.notes}</p>
        <p className="text-body-sm">{manager.notes || '-'}</p>
      </article>

      <p className={`${styles.countHeading} text-label`}>{texts.buildings}</p>

      <ul className={styles.detailsCounts}>
        <li className={styles.countLi}>
          <p className={`${styles.countTitle} text-body-sm`}>{texts.totalBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.total}</p>
        </li>
        <li className={styles.countLi}>
          <p className={`${styles.countTitle} text-body-sm`}>{texts.activeBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.active}</p>
        </li>
        <li className={styles.countLi}>
          <p className={`${styles.countTitle} text-body-sm`}>{texts.inactiveBuildings}</p>
          <p className={styles.totalP}>{manager.buildingCounts.inactive}</p>
        </li>
      </ul>
    </section>
  );
};

export default PropertyManagerDetails;
