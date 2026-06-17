'use client';

import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import type { WeeklySchedule } from '../../../types/calendar';
import { BusinessHoursStatus, type FooterHoursStatusCopy } from '../footer/BusinessHoursStatus';
import styles from './CompanyContact.module.css';

export interface CompanyContactDetails {
  email: string;
  phone: string;
  address: string;
}

export interface CompanyContactProps {
  contact: CompanyContactDetails;
  schedule: WeeklySchedule;
  locale: string;
  hoursStatus?: FooterHoursStatusCopy;
  ariaLabel?: string;
  emailAriaLabel?: string;
  phoneAriaLabel?: string;
  addressAriaLabel?: string;
  className?: string;
}

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function CompanyContact({
  contact,
  schedule,
  locale,
  hoursStatus,
  ariaLabel,
  emailAriaLabel,
  phoneAriaLabel,
  addressAriaLabel,
  className,
}: CompanyContactProps) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  return (
    <section className={cx(styles.contactSection, className)} aria-label={ariaLabel}>
      <address className={styles.contactDetails}>
        <ul className={styles.contactList}>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuMail />
            </span>
            <a
              className={`button-link ${styles.contactLink}`}
              href={`mailto:${contact.email}`}
              aria-label={emailAriaLabel}
            >
              {contact.email}
            </a>
          </li>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuPhone />
            </span>
            <a
              className={`button-link ${styles.contactLink}`}
              href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
              aria-label={phoneAriaLabel}
            >
              {contact.phone}
            </a>
          </li>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuMapPin />
            </span>
            <a
              className={`button-link ${styles.contactLink}`}
              href={mapsHref}
              aria-label={addressAriaLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contact.address}
            </a>
          </li>
        </ul>
      </address>
      <BusinessHoursStatus schedule={schedule} copy={hoursStatus} locale={locale} />
    </section>
  );
}
