'use client';

import Link from 'next/link';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import styles from './page.module.css';
import { FiExternalLink } from 'react-icons/fi';
import { IoIosLink } from 'react-icons/io';
import { useCookies } from '@/packages/contexts/cookies/CookiesContext';
import { FinalCTA, FinalCTASkeleton } from '@/packages/components/client';
import { useRouter } from 'next/navigation';

export interface CookiesPolicyPageTexts {
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
    cta: { label: string; action: string };
  };
  whatAreCookies: {
    title: string;
    body: string;
  };
  types: {
    title: string;
    items: {
      name: string;
      description: string;
    }[];
  };
  thirdParties: {
    title: string;
    body: string;
    table: {
      headers: { name: string; purpose: string; privacy: string };
      body: {
        name: string;
        purpose: string;
        privacyUrl: { label: string; href: string };
      }[];
    };
  };
  localStorage: {
    title: string;
    body: string;
  };
  management: {
    title: string;
    intro: string;
    methods: string[];
    cta: {
      label: string;
      action: string;
    };
    links: { label: string; href: string }[];
  };
  legalBasis: {
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
  havenova: {
    label: string;
    name: { label: string; value: string };
    phone: { label: string; value: string };
    address: { label: string; value: string };
    email: { label: string; value: string };
  }[];
  cta: { label: string; href: string };
}

export default function CookiesPolicyPage() {
  const { client } = useClient();
  const { texts } = useI18n();
  const { openManager } = useCookies();
  const router = useRouter();

  const cookies: CookiesPolicyPageTexts = texts?.pages?.legal?.cookies;
  const finalCtaTexts = texts.components.common.finalCta;

  if (!client || !cookies) return null;

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
        <h1>{cookies.hero.headline1}</h1>
        <h3 className={styles.h3}>{cookies.hero.headline2}</h3>
        <p className={styles.header_p}>{cookies.hero.subtitle}</p>
      </section>

      {/* Overview */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.overview.title}</h3>
        <p>{cookies.overview.intro}</p>
        <ul className={styles.ul}>
          {cookies.overview.bullets.map((bullet, i) => (
            <li key={i}>
              <p>{bullet}</p>
            </li>
          ))}
        </ul>
        <button className={styles.link} onClick={openManager}>
          {cookies.overview.cta.label} <IoIosLink />
        </button>
      </section>

      {/* whatAreCookies */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.whatAreCookies.title}</h3>
        <p>{cookies.whatAreCookies.body}</p>
      </section>

      {/* types */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.types.title}</h3>
        <ul className={styles.ul}>
          {cookies.types.items.map((item, i) => (
            <li key={i}>
              <h4 className={styles.h4}>{item.name}</h4>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* thirdParties */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.thirdParties.title}</h3>
        <p>{cookies.thirdParties.body}</p>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <th className={styles.th}>{cookies.thirdParties.table.headers.name}</th>
              <th className={styles.th}>{cookies.thirdParties.table.headers.purpose}</th>
              <th className={styles.th}>{cookies.thirdParties.table.headers.privacy}</th>
            </tr>
          </thead>
          <tbody className={styles.body}>
            {cookies.thirdParties.table.body.map((item, i) => (
              <tr className={styles.tr} key={i}>
                <td className={styles.td}>{item.name}</td>
                <td className={styles.td}>{item.purpose}</td>
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

      {/* localStorage */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.localStorage.title}</h3>
        <p>{cookies.thirdParties.body}</p>
      </section>

      {/* management */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.management.title}</h3>
        <p>{cookies.management.intro}</p>
        <ul className={styles.ul}>
          {cookies.management.methods.map((item, i) => (
            <li key={i}>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <ul className={styles.ul}>
          {cookies.management.links.map((link, i) => (
            <li key={i}>
              <Link
                href={link.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label} <FiExternalLink />
              </Link>
            </li>
          ))}
          <li key={cookies.management.cta.action}>
            <button className={styles.link} onClick={openManager}>
              {cookies.overview.cta.label} <IoIosLink />
            </button>
          </li>
        </ul>
      </section>

      {/* legalBasis */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.legalBasis.title}</h3>
        <p>{cookies.legalBasis.body}</p>
      </section>

      {/* changes */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.changes.title}</h3>
        <p>{cookies.changes.body}</p>
        <aside className={styles.aside}>
          <p>
            <strong>{cookies.changes.meta.lastUpdated}</strong>
          </p>
          <p>
            <em>{formatDate(legalUpdates?.lastCookiesUpdate || '')}</em>
          </p>
        </aside>
      </section>

      {/* legalReferences */}
      <section className={styles.section}>
        <h3 className={styles.h3}>{cookies.legalReferences.title}</h3>
        <ul className={styles.ul}>
          {cookies.legalReferences.items.map((item, i) => (
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
