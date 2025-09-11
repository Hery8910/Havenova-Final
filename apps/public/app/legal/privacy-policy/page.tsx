// components/legal/PrivacyPolicyPage.tsx
'use client';
import Link from 'next/link';
import { useClient } from '../../../../../packages/contexts/ClientContext';
import { useI18n } from '../../../../../packages/contexts/I18nContext';
import styles from './page.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';

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
  retention: { title: string; body: string };
  internationalTransfers: { title: string; body: string };
  contact: {
    title: string;
    items: { label: string; title: string; value: string }[];
    cta: { label: string; href: string };
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

export default function PrivacyPolicyPage() {
  const { client } = useClient();
  const { texts } = useI18n();
  const privacy: PrivacyPageTexts = texts?.pages?.legal.privacy;
  const contact: ContactTexts = texts?.contact;

  if (!client) return null;

  const { legalUpdates } = client;

  if (!legalUpdates) return null;

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE').format(date);
  }

  return (
    <main className={styles.main}>
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

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.thirdParties.title}</h3>
        <p>{privacy.thirdParties.subtitle}</p>
        <p>{privacy.thirdParties.intro}</p>

        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th className={styles.th}>{privacy.thirdParties.table.headers.name}</th>
              <th className={styles.th}>{privacy.thirdParties.table.headers.purpose}</th>
              <th className={styles.th}>{privacy.thirdParties.table.headers.region}</th>
              <th className={styles.th}>{privacy.thirdParties.table.headers.privacy}</th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            {privacy.thirdParties.table.body.map((item) => (
              <tr className={styles.tr} key={item.name}>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.purpose}</td>
                <td className={styles.td}>{item.region}</td>
                <td className={styles.td}>
                  <Link
                    className={styles.link}
                    href={item.privacyUrl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.privacyUrl.label} <FiExternalLink />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

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
        <h3 className={styles.h3}>{privacy.retention.title}</h3>
        <p>{privacy.retention.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.internationalTransfers.title}</h3>
        <p>{privacy.internationalTransfers.body}</p>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{contact.title}</h3>
        <ul className={styles.contact_ul}>
          {contact.items.map((item, i) => (
            <li className={styles.contact_li} key={i}>
              <h4 className={styles.h4}>{item.label}</h4>
              <table>
                <tbody className={styles.contact_tbody}>
                  <tr className={styles.contact_tr}>
                    <th className={styles.contact_th} scope="row">
                      {item.name.label}
                    </th>
                    <td className={styles.contact_td}>{item.name.value}</td>
                  </tr>
                  <tr className={styles.contact_tr}>
                    <th className={styles.contact_th} scope="row">
                      {item.phone.label}
                    </th>
                    <td className={styles.contact_td}>{item.phone.value}</td>
                  </tr>
                  <tr className={styles.contact_tr}>
                    <th className={styles.contact_th} scope="row">
                      {item.address.label}
                    </th>
                    <td className={styles.contact_td}>{item.address.value}</td>
                  </tr>
                  <tr className={styles.contact_tr}>
                    <th className={styles.contact_th} scope="row">
                      {item.email.label}
                    </th>
                    <td className={styles.contact_td}>{item.email.value}</td>
                  </tr>
                </tbody>
              </table>
            </li>
          ))}
        </ul>
        <Link className={styles.link} href={contact.cta.href}>
          {contact.cta.label} <IoIosLink />
        </Link>
      </section>

      <section className={styles.section}>
        <h3 className={styles.h3}>{privacy.changes.title}</h3>
        <p>{privacy.changes.body}</p>
        <aside className={styles.aside}>
          <p>
            <strong>{privacy.changes.meta.lastUpdated}</strong>
          </p>
          <p>{formatDate(legalUpdates?.lastPrivacyUpdate || '')}</p>
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
