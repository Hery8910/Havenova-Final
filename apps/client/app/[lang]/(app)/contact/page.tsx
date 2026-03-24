'use client';
import { FAQSection } from '../../../../../../packages/components';
import { ContactFormSection } from '../../../../../../packages/components/client/pages/contact';
import { InfoSection } from '../../../../../../packages/components/client/pages/contact/InfoSection';
import { PageHero, type PageHeroContent } from '../../../../../../packages/components/client/pages/hero';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

interface WeekItem {
  label?: string;
  data: string;
}
export interface ContactPageTexts {
  hero: PageHeroContent;
}
export interface ContactInfoTexts {
  contact: {
    title: string;
    email: string;
    phone: string;
    address: string;
  };
  hour: { week: WeekItem; weekend: WeekItem };
}

export default function Contact() {
  const lang = useLang();
  const { texts } = useI18n();
  const contact: ContactPageTexts = texts?.pages?.client?.contact;
  const contactInfoTexts: ContactInfoTexts = texts?.components?.client?.footer;

  return (
    <main className={styles.main}>
      <PageHero texts={contact.hero} lang={lang} />
      <div className={`${styles.wrapper} card`}>
        <ContactFormSection />
        <InfoSection texts={contactInfoTexts} />
      </div>
      <FAQSection />
    </main>
  );
}
