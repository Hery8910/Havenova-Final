'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useI18n } from '../../../../../../../packages/contexts';

export default function ImprintPage() {
  const { texts } = useI18n();

  const imprintTexts = texts?.pages?.client?.legal?.imprint;

  if (!imprintTexts) return null;

  const providerItems = [
    {
      label: imprintTexts.providerSection.fields.companyName,
      value: imprintTexts.providerSection.values.companyName,
    },
    {
      label: imprintTexts.providerSection.fields.owner,
      value: imprintTexts.providerSection.values.owner,
    },
    {
      label: imprintTexts.providerSection.fields.address,
      value: imprintTexts.providerSection.values.address,
      isAddress: true,
    },
    {
      label: imprintTexts.providerSection.fields.email,
      value: imprintTexts.providerSection.values.email,
      isEmail: true,
    },
    {
      label: imprintTexts.providerSection.fields.phone,
      value: imprintTexts.providerSection.values.phone,
    },
  ].filter((item) => Boolean(item.value));

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
