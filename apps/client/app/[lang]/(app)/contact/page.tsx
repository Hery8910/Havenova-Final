import '../../migration-styles/index.css';
import { resources, type Locale } from '@havenova/i18n';
import { ContactPageView } from '../../../../../../packages/components/client/pages/contact/ContactPage.view';
import type { FAQSectionTexts } from '../../../../../../packages/components/client/faqSection/FAQSection';
import type {
  ContactInfoTexts,
  ContactPageTexts,
} from '../../../../../../packages/components/client/pages/contact/contact.types';

export default function Contact({
  params,
}: {
  params: {
    lang: Locale;
  };
}) {
  const locale = resources[params.lang] ? params.lang : 'de';
  const texts = resources[locale];

  const contact = texts?.pages?.client?.contact as ContactPageTexts | undefined;
  const contactInfo = {
    ...(texts?.components?.client?.footer as ContactInfoTexts | undefined),
    aria: texts?.components?.client?.contact?.aria,
    quickActions: texts?.components?.client?.contact?.quickActions,
  } as ContactInfoTexts | undefined;
  const faq = texts?.components?.client?.faq as FAQSectionTexts | undefined;

  return <ContactPageView contact={contact} contactInfo={contactInfo} faq={faq} lang={locale} />;
}
