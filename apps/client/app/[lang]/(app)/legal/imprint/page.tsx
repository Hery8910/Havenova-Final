'use client';

import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import styles from './page.module.css';
import { ContactInfo, FinalCTA, FinalCTASkeleton } from '@/packages/components/client';
import { useRouter } from 'next/navigation';

export default function ImprintPage() {
  const { texts } = useI18n();
  const router = useRouter();

  const imprintTexts = texts.pages.legal.imprint;
  const contactInfo = texts.contactInfo;
  const finalCtaTexts = texts.components.common.finalCta;

  return (
    <section className={styles.body}>
      <header className={styles.header}>
        <h1>{imprintTexts.hero.headline1}</h1>
        <h2>{imprintTexts.hero.headline2}</h2>
        <p>{imprintTexts.hero.subtitle}</p>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <ContactInfo {...contactInfo} />
        </section>

        <section className={styles.section}>
          <h3>{imprintTexts.responsibleSection.heading}</h3>
          <p>{imprintTexts.responsibleSection.description}</p>
          <p>
            Hasan Al Al-Hayyawi <br />
            Stollberger Str.43,
            <br />
            12627 Berlin
          </p>
        </section>
        {/* Tax ID */}
        <section className={styles.section}>
          <h3>{imprintTexts.taxSection.heading}</h3>
          <p>{imprintTexts.taxSection.descriptionNoId}</p>
        </section>
        {/* Disclaimer */}
        <section className={styles.section}>
          <h3>{imprintTexts.liabilitySection.heading}</h3>
          <p>{imprintTexts.liabilitySection.text}</p>
        </section>
        {/* Online Dispute Resolution */}
        <section className={styles.section}>
          <h3>{imprintTexts.odrSection.heading}</h3>
          <p>{imprintTexts.odrSection.text}</p>
        </section>
      </main>
      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => router.push('/services')} />
      ) : (
        <FinalCTASkeleton />
      )}
    </section>
  );
}
