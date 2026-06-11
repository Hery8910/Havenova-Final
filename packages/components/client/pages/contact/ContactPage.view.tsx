import { FAQSection } from '../../faqSection';
import type { FAQSectionTexts } from '../../faqSection/FAQSection';
import { PageHero } from '../hero';
import { ContactFormSection } from './ContactForm';
import { InfoSection } from './InfoSection';
import {
  resolveContactFaqTexts,
  resolveContactHeroContent,
  resolveContactInfoTexts,
} from './contact.fallbacks';
import type { ContactInfoTexts, ContactPageTexts } from './contact.types';
import styles from './ContactPageView.module.css';

interface ContactPageViewProps {
  contact?: ContactPageTexts;
  contactInfo?: ContactInfoTexts;
  faq?: FAQSectionTexts;
  lang: 'de' | 'en' | 'es';
}

export function ContactPageView({ contact, contactInfo, faq, lang }: ContactPageViewProps) {
  const resolvedInfo = resolveContactInfoTexts(contactInfo, lang);

  return (
    <>
      <PageHero texts={resolveContactHeroContent(contact?.hero, lang)} lang={lang} />
      <main
        id="app-main-content"
        tabIndex={-1}
        className={`${styles.main} v2-contact-page`}
        data-page="contact"
      >
        <div className={styles.wrapper}>
          <ContactFormSection />
          <InfoSection texts={resolvedInfo} locale={lang} />
        </div>
        <FAQSection texts={resolveContactFaqTexts(faq, lang)} />
      </main>
    </>
  );
}
