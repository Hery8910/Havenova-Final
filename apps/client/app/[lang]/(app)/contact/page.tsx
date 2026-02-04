'use client';
import {
  ContactFormSection,
  ContactHeroSection,
} from '../../../../../../packages/components/client/pages/contact';
import { InfoSection } from '../../../../../../packages/components/client/pages/contact/InfoSection';
import { useI18n } from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import styles from './page.module.css';

interface WeekItem {
  label?: string;
  data: string;
}
export interface ContactPageTexts {
  hero: {
    title: string;
    subtitle: string;
    ctas: {
      cleaning: { label: string; href: string };
      maintenance: { label: string; href: string };
    };
  };
}
export interface ContactInfoTexts {
  contact: {
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
      <ContactHeroSection texts={contact.hero} lang={lang} />
      <ContactFormSection />
      <InfoSection texts={contactInfoTexts} />
    </main>
  );
}
