'use client';

import { useId } from 'react';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import type { WeeklySchedule } from '../../../types/calendar';
import { BusinessHoursStatus, type FooterHoursStatusCopy } from '../footer/BusinessHoursStatus';
import styles from './CompanyContact.module.css';

export interface CompanyContactDetails {
  title?: string;
  email: string;
  phone: string;
  address: string;
}

export interface CompanyContactProps {
  contact: CompanyContactDetails;
  schedule: WeeklySchedule;
  hoursStatus?: FooterHoursStatusCopy;
  ariaLabel?: string;
  emailAriaLabel?: string;
  phoneAriaLabel?: string;
  className?: string;
  headingClassName?: string;
  headingAs?: 'h2' | 'h3' | 'h4';
}

function cx(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export function CompanyContact({
  contact,
  schedule,
  hoursStatus,
  ariaLabel,
  emailAriaLabel,
  phoneAriaLabel,
  className,
  headingClassName,
  headingAs = 'h2',
}: CompanyContactProps) {
  const headingId = useId();
  const Heading = headingAs;

  return (
    <section className={cx(styles.contactSection, className)} aria-label={ariaLabel} aria-labelledby={headingId}>
      <Heading className={cx(styles.heading, headingClassName)} id={headingId}>
        {contact.title}
      </Heading>
      <address className={styles.contactDetails}>
        <ul className={styles.contactList}>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuMail />
            </span>
            <a
              className={styles.contactLink}
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
              className={styles.contactLink}
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
            <p className={styles.contactLabel}>{contact.address}</p>
          </li>
        </ul>
      </address>
      <BusinessHoursStatus schedule={schedule} copy={hoursStatus} />
    </section>
  );
}
