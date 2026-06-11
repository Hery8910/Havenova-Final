'use client';

import { useId } from 'react';
import { useLang } from '../../../../../../hooks';
import { formatUserAddress } from '../../../../../../types';
import type {
  CleaningFrequency,
  PropertySizeRange,
} from '../../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../../types/calendar';
import type {
  CleaningRequestCustomerType,
  CleaningWorkAddressSelection,
} from '../cleaningRequest.types';
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
  showHeader = true,
  texts,
  customerType,
  frequency,
  property,
  scheduling,
  workAddress,
  common,
}: {
  showHeader?: boolean;
  texts: ReviewTexts;
  customerType: {
    selected: CleaningRequestCustomerType;
    options: Record<CleaningRequestCustomerType, string>;
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
  workAddress: CleaningWorkAddressSelection;
  common: {
    yes: string;
    no: string;
  };
}) {
  const titleId = useId();
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
    <section className={styles.container} aria-labelledby={titleId}>
      {showHeader ? (
        <header className={styles.header}>
          <h3 id={titleId} className={styles.title}>
            {texts.title}
          </h3>
          <p className={styles.description}>{texts.description}</p>
        </header>
      ) : null}

      <section className={styles.grid}>
        <h4 className={`${styles.cardTitle} type-body-lg`}>
          <span className={styles.title}>{texts.sections.customer}</span>
          <span className={styles.titleLine}>{''}</span>
        </h4>
        <article className={styles.card}>
          <ul className={styles.list}>
            <li key={texts.labels.customerType} className={styles.item}>
              <span className={styles.label}>{texts.labels.customerType}:</span>
              <span className={styles.value}>{customerType.options[customerType.selected]}</span>
            </li>
            <li key={texts.labels.frequency} className={styles.item}>
              <span className={styles.label}>{texts.labels.frequency}:</span>
              <span className={styles.value}>{frequency.options[frequency.selected]}</span>
            </li>
            <li key={texts.labels.visitDate} className={styles.item}>
              <span className={styles.label}>{texts.labels.visitDate}:</span>
              <span className={styles.value}>{dateFormatter.format(scheduling.start)}</span>
            </li>
            <li key={texts.labels.visitTime} className={styles.item}>
              <span className={styles.label}>{texts.labels.visitTime}:</span>
              <span className={styles.value}>
                {timeFormatter.format(scheduling.start)} - {timeFormatter.format(scheduling.end)}
              </span>
            </li>
          </ul>
        </article>

        <article className={styles.card}>
          <h4 className={`${styles.cardTitle} type-body-lg`}>
            <span className={styles.title}>{texts.sections.property}</span>
            <span className={styles.titleLine}>{''}</span>
          </h4>
          <ul className={styles.list}>
            <li key={texts.labels.sizeRange} className={styles.item}>
              <span className={styles.label}>{texts.labels.sizeRange}</span>
              <span className={styles.value}>{property.sizeRangeOptions[property.sizeRange]}</span>
            </li>
            <li key={texts.labels.roomsCount} className={styles.item}>
              <span className={styles.label}>{texts.labels.roomsCount}</span>
              <span className={styles.value}>{property.roomsCount}</span>
            </li>
            <li key={texts.labels.hasBalcony} className={styles.item}>
              <span className={styles.label}>{texts.labels.hasBalcony}</span>
              <span className={styles.value}>{property.hasBalcony ? common.yes : common.no}</span>
            </li>
            <li key={texts.labels.hasIndoorStairs} className={styles.item}>
              <span className={styles.label}>{texts.labels.hasIndoorStairs}</span>
              <span className={styles.value}>
                {property.hasIndoorStairs ? common.yes : common.no}
              </span>
            </li>
            <li key={texts.labels.hasPets} className={styles.item}>
              <span className={styles.label}>{texts.labels.hasPets}</span>
              <span className={styles.value}>{property.hasPets ? common.yes : common.no}</span>
            </li>
            <li key={texts.labels.details} className={styles.itemDetails}>
              <span className={styles.label}>{texts.labels.details}</span>
              <span className={styles.value}>{property.details || texts.emptyDetails}</span>
            </li>
          </ul>
        </article>

        <article className={`${styles.card} ${styles.cardFull}`}>
          <h4 className={`${styles.cardTitle} type-body-lg`}>
            <span className={styles.title}>{texts.sections.address}</span>
            <span className={styles.titleLine}>{''}</span>
          </h4>
          <p key={texts.labels.address} className={styles.adress}>
            {workAddress.source === 'primary' ? (
              <span className={styles.label}>{texts.sourceOptions.primary}</span>
            ) : null}
            {workAddress.source === 'saved' && workAddress.label ? (
              <span className={styles.label}>{workAddress.label}</span>
            ) : null}
            {workAddress.source === 'new' && workAddress.label ? (
              <span className={styles.label}>{workAddress.label}</span>
            ) : null}

            <span className={styles.value}>{formatUserAddress(workAddress.address)}</span>
          </p>
        </article>
      </section>
    </section>
  );
}
