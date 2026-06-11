'use client';

import { useClient, useI18n } from '../../../../../../../packages/contexts';
import styles from './page.module.css';
import type { ClientLegalNamedParty } from '../../../../../../../packages/types';
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
  parties: {
    title: string;
    intro: string;
    serviceProvider: {
      title: string;
      description: string;
    };
    technicalOperator: {
      title: string;
      description: string;
    };
    fields: {
      businessName: string;
      legalName: string;
      representedBy: string;
      address: string;
      email: string;
      phone: string;
    };
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

type PartyItem = {
  label: string;
  value: string;
  isAddress?: boolean;
  isEmail?: boolean;
};

function buildPartyItems(
  party: ClientLegalNamedParty | undefined,
  fields: TermsOfServicePageTexts['parties']['fields']
): PartyItem[] {
  if (!party) return [];

  return [
    {
      label: fields.businessName,
      value: party.businessName ?? '',
    },
    {
      label: fields.legalName,
      value: party.legalName ?? '',
    },
    {
      label: fields.representedBy,
      value: party.representedBy ?? '',
    },
    {
      label: fields.address,
      value: party.contact?.address ?? '',
      isAddress: true,
    },
    {
      label: fields.email,
      value: party.contact?.email ?? '',
      isEmail: true,
    },
    {
      label: fields.phone,
      value: party.contact?.phone ?? '',
    },
  ].filter((item) => Boolean(item.value));
}

export default function TermsOfServicePage() {
  const { client } = useClient();
  const { texts, language } = useI18n();
  const terms: TermsOfServicePageTexts = texts?.pages?.client?.legal?.terms;

  if (!client || !terms) return null;

  const legalUpdates = client.legal?.updates;

  const serviceProvider = client.legal?.serviceProvider ?? {
    businessName: client.identity.displayName ?? client.identity.companyName,
    legalName: client.identity.legalName,
    contact: {
      address: client.identity.address,
      email: client.identity.contactEmail,
      phone: client.identity.phone,
    },
  };

  const technicalOperator = client.legal?.technicalOperator ?? {
    businessName: 'Maped Solutions',
    legalName: 'Heriberto Santana',
    representedBy: 'Heriberto Santana',
    contact: {
      address: 'Sarah-Kirsch-Str. 5, 12629 Berlin',
      email: 'contact@mapedsolutions.com',
      phone: '+49 177 7312 606',
    },
  };

  const serviceProviderItems = buildPartyItems(serviceProvider, terms.parties.fields);
  const technicalOperatorItems = buildPartyItems(technicalOperator, terms.parties.fields);

  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(language).format(date);
  }

  return (
    <main id="app-main-content" tabIndex={-1} className={styles.main}>
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

      <section className={styles.section}>
        <h3 className={styles.h3}>{terms.parties.title}</h3>
        <p>{terms.parties.intro}</p>

        <h4 className={styles.h4}>{terms.parties.serviceProvider.title}</h4>
        <p>{terms.parties.serviceProvider.description}</p>
        <dl className={styles.definition_list}>
          {serviceProviderItems.map((item) => (
            <div className={styles.definition_item} key={item.label}>
              <dt className={styles.definition_term}>{item.label}</dt>
              <dd className={styles.definition_desc}>
                {item.isEmail ? (
                  <a className={styles.link} href={`mailto:${item.value}`}>
                    {item.value}
                  </a>
                ) : item.isAddress ? (
                  <address className={styles.address}>{item.value}</address>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <h4 className={styles.h4}>{terms.parties.technicalOperator.title}</h4>
        <p>{terms.parties.technicalOperator.description}</p>
        <dl className={styles.definition_list}>
          {technicalOperatorItems.map((item) => (
            <div className={styles.definition_item} key={item.label}>
              <dt className={styles.definition_term}>{item.label}</dt>
              <dd className={styles.definition_desc}>
                {item.isEmail ? (
                  <a className={styles.link} href={`mailto:${item.value}`}>
                    {item.value}
                  </a>
                ) : item.isAddress ? (
                  <address className={styles.address}>{item.value}</address>
                ) : (
                  item.value
                )}
              </dd>
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
          <p>{formatDate(String(legalUpdates?.terms?.updatedAt ?? ''))}</p>
        </aside>
      </section>
    </main>
  );
}
