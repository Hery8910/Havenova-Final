'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useClient, useI18n } from '../../../../../../../packages/contexts';

export default function ImprintPage() {
  const { client } = useClient();
  const { texts } = useI18n();
  const router = useRouter();

  const imprintTexts = texts?.pages?.client?.legal?.imprint;

  if (!imprintTexts) return null;

  const providerItems = [
    {
      label: imprintTexts.providerSection.fields.companyName,
      value: client?.companyName ?? imprintTexts.providerSection.fallbacks.companyName,
    },
    {
      label: imprintTexts.providerSection.fields.address,
      value: client?.address ?? imprintTexts.providerSection.fallbacks.address,
      isAddress: true,
    },
    {
      label: imprintTexts.providerSection.fields.email,
      value: client?.contactEmail ?? imprintTexts.providerSection.fallbacks.email,
      isEmail: true,
    },
    {
      label: imprintTexts.providerSection.fields.phone,
      value: client?.phone ?? imprintTexts.providerSection.fallbacks.phone,
    },
  ].filter((item) => Boolean(item.value));

  const responsibleAddress =
    imprintTexts.responsibleSection.address ||
    client?.address ||
    imprintTexts.providerSection.fallbacks.address;

  return (
    <main className={styles.body}>
      <header className={styles.header}>
        <h1>{imprintTexts.hero.headline1}</h1>
        <h2>{imprintTexts.hero.headline2}</h2>
        <p>{imprintTexts.hero.subtitle}</p>
      </header>
      <section className={styles.section}>
        <h3>{imprintTexts.providerSection.heading}</h3>
        <p>{imprintTexts.providerSection.description}</p>
        <dl className={styles.definition_list}>
          {providerItems.map((item) => (
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

      <section className={styles.section}>
        <h3>{imprintTexts.responsibleSection.heading}</h3>
        <p>{imprintTexts.responsibleSection.description}</p>
        <p className={styles.responsible_name}>{imprintTexts.responsibleSection.name}</p>
        {responsibleAddress ? (
          <address className={styles.address}>{responsibleAddress}</address>
        ) : null}
      </section>

      <section className={styles.section}>
        <h3>{imprintTexts.liabilitySection.heading}</h3>
        <p>{imprintTexts.liabilitySection.text}</p>
      </section>

      <section className={styles.section}>
        <h3>{imprintTexts.odrSection.heading}</h3>
        <p>{imprintTexts.odrSection.text}</p>
        <Link
          className={styles.link}
          href={imprintTexts.odrSection.link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {imprintTexts.odrSection.link.label}
        </Link>
        <p>{imprintTexts.odrSection.note}</p>
      </section>
    </main>
  );
}
