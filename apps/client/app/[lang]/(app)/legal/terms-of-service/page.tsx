'use client';

import { useClient, useI18n } from '../../../../../../../packages/contexts';
import styles from './page.module.css';
export interface TermsOfServicePageTexts {
  hero: {
    headline1: string;
    headline2: string;
    subtitle: string;
    image: { src: string; alt: string };
  };
  overview: {
    title: string;
    intro: string;
    bullets: string[];
  };
  definitions: {
    title: string;
    items: { term: string; definition: string }[];
  };
  serviceDescription: {
    title: string;
    body: string;
    note: string;
  };
  optimization: {
    title: string;
    body: string;
  };
  userObligations: {
    title: string;
    items: string[];
  };
  availability: {
    title: string;
    body: string;
  };
  externalContractors: {
    title: string;
    body: string;
  };
  liability: {
    title: string;
    body: string;
    limitations: string[];
  };
  payments: {
    title: string;
    body: string;
  };
  termination: {
    title: string;
    body: string;
  };
  dataProtection: {
    title: string;
    body: string;
  };
  governingLaw: {
    title: string;
    body: string;
  };
  changes: {
    title: string;
    body: string;
    meta: { lastUpdated: string };
  };
}

export interface ContactTexts {
  title: string;
  items: {
    label: string;
    name: { label: string; value: string };
    phone: { label: string; value: string };
    address: { label: string; value: string };
    email: { label: string; value: string };
  }[];
  cta: { label: string; href: string };
}

export default function TermsOfServicePage() {
  const { client } = useClient();
  const { texts } = useI18n();
  const terms: TermsOfServicePageTexts = texts?.pages?.client?.legal?.terms;

  if (!client || !terms) return null;

  const { legalUpdates } = client;

  if (!legalUpdates) return null;

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE').format(date);
  }

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.section}>
        <h1>{terms.hero.headline1}</h1>
        <h3 className={styles.h3}>{terms.hero.headline2}</h3>
        <p className={styles.header_p}>{terms.hero.subtitle}</p>
      </section>

      {/* Overview */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.overview.title}</h3>
        <p>{terms.overview.intro}</p>
        <ul className={styles.ul}>
          {terms.overview.bullets.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Definitions */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.definitions.title}</h3>
        <dl className={styles.definition_list}>
          {terms.definitions.items.map((item) => (
            <div className={styles.definition_item} key={item.term}>
              <dt className={styles.definition_term}>{item.term}</dt>
              <dd className={styles.definition_desc}>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Service Description */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.serviceDescription.title}</h3>
        <p>{terms.serviceDescription.body}</p>
        <p className={styles.note}>{terms.serviceDescription.note}</p>
      </section>

      {/* Continuous Optimization */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.optimization.title}</h3>
        <p>{terms.optimization.body}</p>
      </section>

      {/* User Obligations */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.userObligations.title}</h3>
        <ul className={styles.ul}>
          {terms.userObligations.items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Availability */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.availability.title}</h3>
        <p>{terms.availability.body}</p>
      </section>

      {/* External Contractors */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.externalContractors.title}</h3>
        <p>{terms.externalContractors.body}</p>
      </section>

      {/* Liability */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.liability.title}</h3>
        <p>{terms.liability.body}</p>
        <ul className={styles.ul}>
          {terms.liability.limitations.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Payments */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.payments.title}</h3>
        <p>{terms.payments.body}</p>
      </section>

      {/* Termination */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.termination.title}</h3>
        <p>{terms.termination.body}</p>
      </section>

      {/* Data Protection */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.dataProtection.title}</h3>
        <p>{terms.dataProtection.body}</p>
      </section>

      {/* Governing Law */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.governingLaw.title}</h3>
        <p>{terms.governingLaw.body}</p>
      </section>

      {/* Changes */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.changes.title}</h3>
        <p>{terms.changes.body}</p>
        <aside className={styles.aside}>
          <p>
            <strong>{terms.changes.meta.lastUpdated}</strong>
          </p>
          <p>{formatDate(legalUpdates?.terms?.updatedAt || '')}</p>
        </aside>
      </section>
    </main>
  );
}
