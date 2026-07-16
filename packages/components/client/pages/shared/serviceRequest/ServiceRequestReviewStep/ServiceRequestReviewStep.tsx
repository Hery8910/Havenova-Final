'use client';

import { RequestStepIntro } from '../RequestStepIntro';
import styles from './ServiceRequestReviewStep.module.css';

export interface ServiceRequestReviewRow {
  label: string;
  value: string | number;
  details?: boolean;
}

export interface ServiceRequestReviewSection {
  title: string;
  rows: ServiceRequestReviewRow[];
}

interface ServiceRequestReviewStepProps {
  showHeader?: boolean;
  title: string;
  description: string;
  sections: ServiceRequestReviewSection[];
}

export function ServiceRequestReviewStep({
  showHeader = true,
  title,
  description,
  sections,
}: ServiceRequestReviewStepProps) {
  return (
    <section className={styles.container}>
      {showHeader ? <RequestStepIntro title={title} description={description} /> : null}

      <section className={styles.grid}>
        {sections.map((section) => (
          <article key={section.title} className={styles.card}>
            <h4 className={`${styles.cardTitle} type-body-lg`}>
              <span className={styles.title}>{section.title}</span>
              <span className={styles.titleLine}>{''}</span>
            </h4>
            <ul className={styles.list}>
              {section.rows.map((row) => (
                <li
                  key={`${section.title}-${row.label}`}
                  className={row.details ? styles.itemDetails : styles.item}
                >
                  <span className={styles.label}>{row.label}</span>
                  <span className={styles.value}>{row.value}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </section>
  );
}
