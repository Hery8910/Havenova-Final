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
import { RequestStepIntro } from '../../../shared';

type ReviewRow = {
  label: string;
  value: string | number;
  details?: boolean;
};

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
  const customerRows: ReviewRow[] = [
    {
      label: texts.labels.customerType,
      value: customerType.options[customerType.selected],
    },
    {
      label: texts.labels.frequency,
      value: frequency.options[frequency.selected],
    },
    {
      label: texts.labels.visitDate,
      value: dateFormatter.format(scheduling.start),
    },
    {
      label: texts.labels.visitTime,
      value: `${timeFormatter.format(scheduling.start)} - ${timeFormatter.format(scheduling.end)}`,
    },
  ];
  const propertyRows: ReviewRow[] = [
    {
      label: texts.labels.sizeRange,
      value: property.sizeRangeOptions[property.sizeRange],
    },
    {
      label: texts.labels.roomsCount,
      value: property.roomsCount,
    },
    {
      label: texts.labels.hasBalcony,
      value: property.hasBalcony ? common.yes : common.no,
    },
    {
      label: texts.labels.hasIndoorStairs,
      value: property.hasIndoorStairs ? common.yes : common.no,
    },
    {
      label: texts.labels.hasPets,
      value: property.hasPets ? common.yes : common.no,
    },
    {
      label: texts.labels.details,
      value: property.details || texts.emptyDetails,
      details: true,
    },
  ];
  const addressLabel =
    workAddress.source === 'primary'
      ? texts.sourceOptions.primary
      : workAddress.label || (workAddress.source === 'saved' ? texts.sourceOptions.saved : '');

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      {showHeader ? (
        <RequestStepIntro title={texts.title} titleId={titleId} description={texts.description} />
      ) : null}

      <section className={styles.grid}>
        <article className={styles.card}>
          <h4 className={`${styles.cardTitle} type-body-lg`}>
            <span className={styles.title}>{texts.sections.customer}</span>
            <span className={styles.titleLine}>{''}</span>
          </h4>
          <ul className={styles.list}>
            {customerRows.map((row) => (
              <li key={row.label} className={row.details ? styles.itemDetails : styles.item}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.value}>{row.value}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h4 className={`${styles.cardTitle} type-body-lg`}>
            <span className={styles.title}>{texts.sections.property}</span>
            <span className={styles.titleLine}>{''}</span>
          </h4>
          <ul className={styles.list}>
            {propertyRows.map((row) => (
              <li key={row.label} className={row.details ? styles.itemDetails : styles.item}>
                <span className={styles.label}>{row.label}</span>
                <span className={styles.value}>{row.value}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.card}>
          <h4 className={`${styles.cardTitle} type-body-lg`}>
            <span className={styles.title}>{texts.sections.address}</span>
            <span className={styles.titleLine}>{''}</span>
          </h4>
          <p className={styles.address}>
            {addressLabel ? <span className={styles.label}>{addressLabel}</span> : null}
            <span className={styles.value}>{formatUserAddress(workAddress.address)}</span>
          </p>
        </article>
      </section>
    </section>
  );
}
