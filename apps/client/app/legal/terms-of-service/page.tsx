'use client';

import Link from 'next/link';
import { useClient } from '../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
import styles from './page.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';
import { FinalCTA, FinalCTASkeleton } from '../../../../../packages/components/common';
import { useRouter } from 'next/navigation';

export interface TermsOfServicePageTexts {
  hero: {
    headline1: string;
    headline2: string;
    subtitle: string;
    image: { src: string; alt: string };
  };
  intro: {
    title: string;
    body: string;
  };
  scope: {
    title: string;
    body: string;
  };
  userObligations: {
    title: string;
    items: string[];
  };
  providerRights: {
    title: string;
    items: string[];
  };
  payments: {
    title: string;
    body: string;
    items: string[];
  };
  cancellation: {
    title: string;
    body: string;
  };
  liability: {
    title: string;
    body: string;
  };
  changes: {
    title: string;
    body: string;
    meta: { lastUpdated: string };
  };
  legalReferences: {
    title: string;
    items: { label: string; href: string }[];
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
  const router = useRouter();

  const terms: TermsOfServicePageTexts = texts?.pages?.legal?.terms;
  const finalCtaTexts = texts.components.common.finalCta;

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

      {/* Introducción */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.intro.title}</h3>
        <p>{terms.intro.body}</p>
      </section>

      {/* Alcance */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.scope.title}</h3>
        <p>{terms.scope.body}</p>
      </section>

      {/* Obligaciones del usuario */}
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

      {/* Derechos del proveedor */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.providerRights.title}</h3>
        <ul className={styles.ul}>
          {terms.providerRights.items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Pagos y condiciones */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.payments.title}</h3>
        <p>{terms.payments.body}</p>
        <ul className={styles.ul}>
          {terms.payments.items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Cancelación */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.cancellation.title}</h3>
        <p>{terms.cancellation.body}</p>
      </section>

      {/* Responsabilidad */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.liability.title}</h3>
        <p>{terms.liability.body}</p>
      </section>

      {/* Cambios */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.changes.title}</h3>
        <p>{terms.changes.body}</p>
        <aside className={styles.aside}>
          <p>
            <strong>{terms.changes.meta.lastUpdated}</strong>
          </p>
          <p>{formatDate(legalUpdates?.lastTermsUpdate || '')}</p>
        </aside>
      </section>

      {/* Referencias legales */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.legalReferences.title}</h3>
        <ul className={styles.ul}>
          {terms.legalReferences.items.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label} <FiExternalLink />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => router.push('/services')} />
      ) : (
        <FinalCTASkeleton />
      )}
    </main>
  );
}
