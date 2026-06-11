// components/legal/PrivacyPolicyPage.tsx
'use client';
import Link from 'next/link';
import styles from './page.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';
import { useClient, useI18n } from '../../../../../../../packages/contexts';
import type {
  ClientLegalDpoContact,
  ClientLegalNamedParty,
  ClientLegalThirdPartyProvider,
} from '../../../../../../../packages/types';

export interface PrivacyPageTexts {
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
    cta: { label: string; href: string };
  };
  roles: {
    title: string;
    controller: {
      title: string;
      body: string;
    };
    processor: {
      title: string;
      body: string;
    };
    links: { label: string; href: string }[];
  };
  contacts: {
    title: string;
    intro: string;
    controller: {
      title: string;
      description: string;
    };
    technicalOperator: {
      title: string;
      description: string;
    };
    dpo: {
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
      name: string;
    };
    unavailable: {
      notApplicable: string;
      notAvailable: string;
    };
  };
  accountStructure: {
    title: string;
    body: string;
  };
  purposesAndLegalBases: {
    title: string;
    intro: string;
    items: {
      purpose: string;
      examples: { title: string; description: string };
      legalBases: { title: string; description: string };
    }[];
  };
  dataCategories: {
    title: string;
    description: string;
    items: string[];
  };
  thirdParties: {
    title: string;
    subtitle: string;
    intro: string;
    table: {
      headers: { name: string; purpose: string; region: string; privacy: string };
      body: {
        name: string;
        purpose: string;
        region: string;
        privacyUrl: { label: string; href: string };
      }[];
    };
  };
  security: { title: string; body: string };
  cookies: {
    title: string;
    body: string;
    cta: { label: string; href: string };
  };
  userRights: {
    title: string;
    intro: string;
    items: string[];
    howTo: string;
  };
  accountDeletion: {
    title: string;
    body: string;
  };
  retention: {
    title: string;
    body: string;
    additional: {
      title: string;
      bullets: string[];
      close: string;
    };
  };
  internationalTransfers: { title: string; body: string };
  additionalInformation: {
    title: string;
    items: { title: string; body: string }[];
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

type ContactItem = {
  label: string;
  value: string;
  isAddress?: boolean;
  isEmail?: boolean;
};

function buildNamedPartyItems(
  party: ClientLegalNamedParty | undefined,
  fields: PrivacyPageTexts['contacts']['fields']
): ContactItem[] {
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

function buildDpoItems(
  dpo: ClientLegalDpoContact | undefined,
  fields: PrivacyPageTexts['contacts']['fields'],
  unavailable: PrivacyPageTexts['contacts']['unavailable']
): ContactItem[] {
  if (!dpo) return [];

  if (dpo.status !== 'available') {
    return [
      {
        label: fields.name,
        value: dpo.status === 'not_applicable' ? unavailable.notApplicable : unavailable.notAvailable,
      },
    ];
  }

  return [
    {
      label: fields.name,
      value: dpo.name ?? '',
    },
    {
      label: fields.email,
      value: dpo.email ?? '',
      isEmail: true,
    },
    {
      label: fields.address,
      value: dpo.address ?? '',
      isAddress: true,
    },
  ].filter((item) => Boolean(item.value));
}

function renderContactList(items: ContactItem[], stylesRef: typeof styles) {
  return (
    <dl className={stylesRef.contact_list}>
      {items.map((item) => (
        <div className={stylesRef.contact_item} key={item.label}>
          <dt className={stylesRef.contact_term}>{item.label}</dt>
          <dd className={stylesRef.contact_desc}>
            {item.isEmail ? (
              <Link className={stylesRef.link} href={`mailto:${item.value}`}>
                {item.value}
              </Link>
            ) : item.isAddress ? (
              <address className={stylesRef.address}>{item.value}</address>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function PrivacyPolicyPage() {
  const { client } = useClient();
  const { texts, language } = useI18n();
  const privacy: PrivacyPageTexts = texts.pages.client.legal.privacy;

  if (!client || !privacy) return null;

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

  const technicalOperator =
    client.legal?.technicalOperator ??
    (privacy.thirdParties.table.body.length > 0
      ? {
          businessName: 'Maped Solutions',
          legalName: 'Heriberto Santana',
          representedBy: 'Heriberto Santana',
          contact: {
            address: 'Sarah-Kirsch-Str. 5, 12629 Berlin',
            email: 'contact@mapedsolutions.com',
            phone: '+49 177 7312 606',
          },
        }
      : undefined);

  const privacyController: ClientLegalNamedParty | undefined =
    client.legal?.privacyController?.sameAs === 'technicalOperator'
      ? technicalOperator
      : client.legal?.privacyController?.sameAs === 'serviceProvider'
        ? serviceProvider
        : client.legal?.privacyController
          ? {
              businessName: client.legal.privacyController.name,
              legalName: client.legal.privacyController.legalName,
              representedBy: client.legal.privacyController.representedBy,
              contact: client.legal.privacyController.contact,
            }
          : serviceProvider;

  const thirdPartyProviders =
    client.legal?.thirdPartyProviders && client.legal.thirdPartyProviders.length > 0
      ? client.legal.thirdPartyProviders
      : privacy.thirdParties.table.body.map((item) => ({
          name: item.name,
          purpose: item.purpose,
          region: item.region,
          privacyUrl: item.privacyUrl.href,
        }));

  const controllerItems = buildNamedPartyItems(privacyController, privacy.contacts.fields);
  const technicalOperatorItems = buildNamedPartyItems(technicalOperator, privacy.contacts.fields);
  const dpoItems = buildDpoItems(client.legal?.dpo, privacy.contacts.fields, privacy.contacts.unavailable);

  function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(language).format(date);
  }

  return (
    <main id="app-main-content" tabIndex={-1} className={styles.main}>
      <section className={styles.section}>
        <h1>{privacy?.hero.headline1}</h1>
        <h3 className={styles.h3}>{privacy.hero.headline2}</h3>
        <p className={styles.header_p}>{privacy.hero.subtitle}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.overview.title}</h3>
        <p>{privacy.overview.intro}</p>
        <ul className={styles.ul}>
          {privacy.overview.bullets.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <Link href={privacy.overview.cta.href} className={styles.link}>
          {privacy.overview.cta.label} <IoIosLink />
        </Link>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.roles.title}</h3>
        <h4 className={styles.h4}>{privacy.roles.controller.title}</h4>
        <p>{privacy.roles.controller.body}</p>

        <h4 className={styles.h4}>{privacy.roles.processor.title}</h4>
        <p>{privacy.roles.processor.body}</p>

        <ul className={styles.ul}>
          {privacy.roles.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.label} <FiExternalLink />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.contacts.title}</h3>
        <p>{privacy.contacts.intro}</p>

        <h4 className={styles.h4}>{privacy.contacts.controller.title}</h4>
        <p>{privacy.contacts.controller.description}</p>
        {renderContactList(controllerItems, styles)}

        {technicalOperatorItems.length > 0 ? (
          <>
            <h4 className={styles.h4}>{privacy.contacts.technicalOperator.title}</h4>
            <p>{privacy.contacts.technicalOperator.description}</p>
            {renderContactList(technicalOperatorItems, styles)}
          </>
        ) : null}

        {dpoItems.length > 0 ? (
          <>
            <h4 className={styles.h4}>{privacy.contacts.dpo.title}</h4>
            <p>{privacy.contacts.dpo.description}</p>
            {renderContactList(dpoItems, styles)}
          </>
        ) : null}
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.accountStructure.title}</h3>
        <p>{privacy.accountStructure.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.purposesAndLegalBases.title}</h3>
        <p>{privacy.purposesAndLegalBases.intro}</p>
        <ul className={styles.ul}>
          {privacy.purposesAndLegalBases.items.map((item, index) => (
            <li className={styles.purpose_li} key={index}>
              <h4 className={styles.h4}>{item.purpose}</h4>
              <table>
                <tbody className={styles.purpose_tbody}>
                  <tr className={styles.purpose_tr}>
                    <th className={styles.purpose_th} scope="row">
                      <p>{item.examples.title}</p>
                    </th>
                    <td className={styles.purpose_td}>
                      <p>{item.examples.description}</p>
                    </td>
                  </tr>
                  <tr className={styles.purpose_tr}>
                    <th className={styles.purpose_th} scope="row">
                      <p>{item.legalBases.title}</p>
                    </th>
                    <td className={styles.purpose_td}>
                      <p>{item.legalBases.description}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.dataCategories.title}</h3>
        <p>{privacy.dataCategories.description}</p>
        <ul className={styles.ul}>
          {privacy.dataCategories.items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </section>

      {
        <section className={styles.section}>
          <h3 className={styles.h3}>{privacy.thirdParties.title}</h3>
          <p>{privacy.thirdParties.subtitle}</p>
          <p>{privacy.thirdParties.intro}</p>

          <div className={styles.table_wrapper}>
            <table className={styles.table}>
              <caption className={styles.visually_hidden}>{privacy.thirdParties.title}</caption>
              <thead className={styles.thead}>
                <tr className={styles.tr}>
                  <th className={styles.th} scope="col">
                    {privacy.thirdParties.table.headers.name}
                  </th>
                  <th className={styles.th} scope="col">
                    {privacy.thirdParties.table.headers.purpose}
                  </th>
                  <th className={styles.th} scope="col">
                    {privacy.thirdParties.table.headers.region}
                  </th>
                  <th className={styles.th} scope="col">
                    {privacy.thirdParties.table.headers.privacy}
                  </th>
                </tr>
              </thead>
              <tbody className={styles.body}>
                {thirdPartyProviders.map((item: ClientLegalThirdPartyProvider) => (
                  <tr className={styles.tr} key={item.name}>
                    <td className={styles.td}>{item.name}</td>
                    <td className={styles.td}>{item.purpose}</td>
                    <td className={styles.td}>{item.region ?? ''}</td>
                    <td className={styles.td}>
                      {item.privacyUrl ? (
                        <Link
                          className={styles.link}
                          href={item.privacyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {privacy.thirdParties.table.headers.privacy} <FiExternalLink />
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      }

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.security.title}</h3>
        <p>{privacy.security.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.cookies.title}</h3>
        <p>{privacy.cookies.body}</p>
        <Link className={styles.link} href={privacy.cookies.cta.href}>
          {privacy.cookies.cta.label} <IoIosLink />
        </Link>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.userRights.title}</h3>
        <p>{privacy.userRights.intro}</p>
        <ul className={styles.ul}>
          {privacy.userRights.items.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <p>{privacy.userRights.howTo}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.accountDeletion.title}</h3>
        <p>{privacy.accountDeletion.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.retention.title}</h3>
        <p>{privacy.retention.body}</p>
        <p>{privacy.retention.additional.title}</p>
        <ul className={styles.ul}>
          {privacy.retention.additional.bullets.map((bullet, i) => (
            <li className={styles.purpose_li} key={i}>
              <p>{bullet}</p>
            </li>
          ))}
        </ul>
        <p>{privacy.retention.additional.close}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.additionalInformation.title}</h3>
        <ul className={styles.ul}>
          {privacy.additionalInformation.items.map((item, i) => (
            <li className={styles.purpose_li} key={i}>
              <h4 className={styles.h4}>{item.title}</h4>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.internationalTransfers.title}</h3>
        <p>{privacy.internationalTransfers.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.changes.title}</h3>
        <p>{privacy.changes.body}</p>
        <aside className={styles.aside}>
          <p>
            <strong>{privacy.changes.meta.lastUpdated}</strong>
          </p>
          <p>{formatDate(String(legalUpdates?.privacy?.updatedAt ?? ''))}</p>
        </aside>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.legalReferences.title}</h3>
        <ul className={styles.ul}>
          {privacy.legalReferences.items.map((ref, i) => (
            <li key={i}>
              <Link
                className={styles.link}
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p>{ref.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
