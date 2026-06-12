'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useClient, useI18n } from '../../../../../../../packages/contexts';
import type {
  ClientLegalField,
  ClientLegalNamedParty,
  ClientLegalRegisterEntry,
  ClientLegalServiceProvider,
} from '../../../../../../../packages/types';

interface ImprintFieldTexts {
  businessName: string;
  legalName: string;
  representedBy: string;
  address: string;
  email: string;
  phone: string;
  vatId: string;
  register: string;
}

interface ImprintTexts {
  hero: {
    headline1: string;
    headline2: string;
    subtitle: string;
  };
  serviceProviderSection: {
    heading: string;
    description: string;
    fields: ImprintFieldTexts;
  };
  technicalOperatorSection: {
    heading: string;
    description: string;
    fields: ImprintFieldTexts;
  };
  contactGuidanceSection: {
    heading: string;
    items: string[];
  };
  unavailable: {
    notApplicable: string;
    notAvailable: string;
  };
  liabilitySection: {
    heading: string;
    text: string;
  };
  odrSection: {
    heading: string;
    text: string;
  };
  providerSection?: {
    values?: {
      companyName?: string;
      owner?: string;
      address?: string;
      email?: string;
      phone?: string;
    };
  };
}

type DefinitionItem = {
  label: string;
  value: string;
  isAddress?: boolean;
  isEmail?: boolean;
};

function isLegalRegisterEntry(
  field: ClientLegalField | ClientLegalRegisterEntry
): field is ClientLegalRegisterEntry {
  return 'court' in field || 'number' in field;
}

function resolveFieldValue(
  field: ClientLegalField | ClientLegalRegisterEntry | undefined,
  unavailableTexts: ImprintTexts['unavailable']
) {
  if (!field) return '';
  if (field.status === 'available') {
    if (!isLegalRegisterEntry(field)) return field.value ?? '';
    const registerParts = [field.court, field.number].filter(Boolean);
    return registerParts.join(', ');
  }
  return field.status === 'not_applicable'
    ? unavailableTexts.notApplicable
    : unavailableTexts.notAvailable;
}

function buildPartyItems(
  fields: ImprintFieldTexts,
  party: ClientLegalNamedParty | undefined,
  unavailableTexts: ImprintTexts['unavailable'],
  extra?: {
    vatId?: ClientLegalField;
    register?: ClientLegalRegisterEntry;
  }
): DefinitionItem[] {
  if (!party) return [];

  const items: DefinitionItem[] = [
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
  ];

  if (extra?.vatId) {
    items.push({
      label: fields.vatId,
      value: resolveFieldValue(extra.vatId, unavailableTexts),
    });
  }

  if (extra?.register) {
    items.push({
      label: fields.register,
      value: resolveFieldValue(extra.register, unavailableTexts),
    });
  }

  return items.filter((item) => Boolean(item.value));
}

export default function ImprintPage() {
  const { client } = useClient();
  const { texts } = useI18n();

  const imprintTexts = texts?.pages?.client?.legal?.imprint as ImprintTexts | undefined;

  if (!imprintTexts || !client) return null;

  const serviceProvider: ClientLegalServiceProvider = client.legal?.serviceProvider ?? {
    businessName: client.identity.displayName ?? client.identity.companyName,
    legalName: client.identity.legalName,
    contact: {
      address: client.identity.address,
      email: client.identity.contactEmail,
      phone: client.identity.phone,
    },
  };

  const technicalOperator =
    client.legal?.technicalOperator ??
    (imprintTexts.providerSection?.values
      ? {
          businessName: imprintTexts.providerSection.values.companyName,
          legalName: imprintTexts.providerSection.values.owner,
          representedBy: imprintTexts.providerSection.values.owner,
          contact: {
            address: imprintTexts.providerSection.values.address,
            email: imprintTexts.providerSection.values.email,
            phone: imprintTexts.providerSection.values.phone,
          },
        }
      : undefined);

  const serviceProviderItems = buildPartyItems(
    imprintTexts.serviceProviderSection.fields,
    serviceProvider,
    imprintTexts.unavailable,
    {
      vatId: serviceProvider.vatId,
      register: serviceProvider.register,
    }
  );

  const technicalOperatorItems = buildPartyItems(
    imprintTexts.technicalOperatorSection.fields,
    technicalOperator,
    imprintTexts.unavailable
  );

  return (
    <main id="app-main-content" tabIndex={-1} className={styles.body}>
      <header className={styles.header}>
        <h1>{imprintTexts.hero.headline1}</h1>
        <h2>{imprintTexts.hero.headline2}</h2>
        <p>{imprintTexts.hero.subtitle}</p>
      </header>
      <section className={styles.section}>
        <h3>{imprintTexts.serviceProviderSection.heading}</h3>
        <p>{imprintTexts.serviceProviderSection.description}</p>
        <dl className={styles.definition_list}>
          {serviceProviderItems.map((item) => (
            <div className={styles.definition_item} key={item.label}>
              <dt className={styles.definition_term}>{item.label}</dt>
              <dd className={styles.definition_desc}>
                {item.isEmail ? (
                  <Link className={styles.link} href={`mailto:${item.value}`}>
                    {item.value}
                  </Link>
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

      {technicalOperatorItems.length > 0 ? (
        <section className={styles.section}>
          <h3>{imprintTexts.technicalOperatorSection.heading}</h3>
          <p>{imprintTexts.technicalOperatorSection.description}</p>
          <dl className={styles.definition_list}>
            {technicalOperatorItems.map((item) => (
              <div className={styles.definition_item} key={item.label}>
                <dt className={styles.definition_term}>{item.label}</dt>
                <dd className={styles.definition_desc}>
                  {item.isEmail ? (
                    <Link className={styles.link} href={`mailto:${item.value}`}>
                      {item.value}
                    </Link>
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
      ) : null}

      <section className={styles.section}>
        <h3>{imprintTexts.contactGuidanceSection.heading}</h3>
        <ul className={styles.definition_list}>
          {imprintTexts.contactGuidanceSection.items.map((item) => (
            <li className={styles.definition_desc} key={item}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>{imprintTexts.liabilitySection.heading}</h3>
        <p>{imprintTexts.liabilitySection.text}</p>
      </section>

      <section className={styles.section}>
        <h3>{imprintTexts.odrSection.heading}</h3>
        <p>{imprintTexts.odrSection.text}</p>
      </section>
    </main>
  );
}
