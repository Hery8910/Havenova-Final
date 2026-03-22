'use client';

import { useLang } from '../../../../../../hooks';
import { formatUserAddress } from '../../../../../../types';
import type {
  CleaningCustomerType,
  CleaningFrequency,
  PropertySizeRange,
  WorkAddressSelection,
} from '../../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../../types/calendar';
import styles from './ReviewStep.module.css';

type ReviewTexts = {
  title: string;
  description: string;
  sections: {
    customer: string;
    property: string;
    scheduling: string;
    address: string;
  };
  labels: {
    customerType: string;
    frequency: string;
    sizeRange: string;
    roomsCount: string;
    hasBalcony: string;
    hasIndoorStairs: string;
    hasPets: string;
    details: string;
    visitDate: string;
    visitTime: string;
    addressSource: string;
    addressLabel: string;
    address: string;
    saveToProfile: string;
  };
  sourceOptions: {
    primary: string;
    saved: string;
    new: string;
  };
  emptyDetails: string;
  finalNote: string;
};

export default function ReviewStep({
  texts,
  customerType,
  frequency,
  property,
  scheduling,
  workAddress,
  common,
}: {
  texts: ReviewTexts;
  customerType: {
    selected: CleaningCustomerType;
    options: Record<CleaningCustomerType, string>;
  };
  frequency: {
    selected: CleaningFrequency;
    options: Record<CleaningFrequency, string>;
  };
  property: {
    sizeRange: PropertySizeRange;
    sizeRangeOptions: Record<PropertySizeRange, string>;
    roomsCount: number;
    hasBalcony: boolean;
    hasIndoorStairs: boolean;
    hasPets: boolean;
    details?: string;
  };
  scheduling: SelectedCalendarSlot;
  workAddress: WorkAddressSelection;
  common: {
    yes: string;
    no: string;
  };
}) {
  const lang = useLang();
  const dateFormatter = new Intl.DateTimeFormat(lang, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat(lang, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className={styles.container} aria-labelledby="cleaning-review-title">
      <header className={styles.header}>
        <h3 id="cleaning-review-title" className={styles.title}>
          {texts.title}
        </h3>
        <p className={styles.description}>{texts.description}</p>
      </header>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h4 className={styles.cardTitle}>{texts.sections.customer}</h4>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.customerType}</span>
              <span className={styles.value}>{customerType.options[customerType.selected]}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.frequency}</span>
              <span className={styles.value}>{frequency.options[frequency.selected]}</span>
            </li>
          </ul>
        </article>

        <article className={styles.card}>
          <h4 className={styles.cardTitle}>{texts.sections.scheduling}</h4>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.visitDate}</span>
              <span className={styles.value}>{dateFormatter.format(scheduling.start)}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.visitTime}</span>
              <span className={styles.value}>
                {timeFormatter.format(scheduling.start)} - {timeFormatter.format(scheduling.end)}
              </span>
            </li>
          </ul>
        </article>

        <article className={styles.card}>
          <h4 className={styles.cardTitle}>{texts.sections.property}</h4>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.sizeRange}</span>
              <span className={styles.value}>{property.sizeRangeOptions[property.sizeRange]}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.roomsCount}</span>
              <span className={styles.value}>{property.roomsCount}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.hasBalcony}</span>
              <span className={styles.value}>{property.hasBalcony ? common.yes : common.no}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.hasIndoorStairs}</span>
              <span className={styles.value}>
                {property.hasIndoorStairs ? common.yes : common.no}
              </span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.hasPets}</span>
              <span className={styles.value}>{property.hasPets ? common.yes : common.no}</span>
            </li>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.details}</span>
              <span className={styles.value}>{property.details || texts.emptyDetails}</span>
            </li>
          </ul>
        </article>

        <article className={`${styles.card} ${styles.cardFull}`}>
          <h4 className={styles.cardTitle}>{texts.sections.address}</h4>
          <ul className={styles.list}>
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.addressSource}</span>
              <span className={styles.value}>{texts.sourceOptions[workAddress.source]}</span>
            </li>
            {workAddress.label ? (
              <li className={styles.item}>
                <span className={styles.label}>{texts.labels.addressLabel}</span>
                <span className={styles.value}>{workAddress.label}</span>
              </li>
            ) : null}
            <li className={styles.item}>
              <span className={styles.label}>{texts.labels.address}</span>
              <span className={styles.value}>{formatUserAddress(workAddress.address)}</span>
            </li>
            {workAddress.source === 'new' ? (
              <li className={styles.item}>
                <span className={styles.label}>{texts.labels.saveToProfile}</span>
                <span className={styles.value}>
                  {workAddress.saveToProfile ? common.yes : common.no}
                </span>
              </li>
            ) : null}
          </ul>
        </article>
      </section>

      <p className={styles.note}>{texts.finalNote}</p>
    </section>
  );
}
