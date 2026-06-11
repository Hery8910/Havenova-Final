import styles from './InfoSection.module.css';
import Image from 'next/image';
import { useClient } from '../../../../../contexts';
import { CompanyContact } from '../../../companyContact';
import type { ContactInfoTexts } from '../contact.types';

export default function InfoSection({
  texts,
  locale,
}: {
  texts: ContactInfoTexts;
  locale: string;
}) {
  const { client } = useClient();
  const ariaTexts = texts.aria;
  const quickTexts = texts.quickActions;

  const telHref = (() => {
    const phone = texts?.contact?.phone;
    if (!phone) return '';
    const normalized = phone.replace(/[^\d+]/g, '');
    return normalized ? `tel:${normalized}` : '';
  })();

  const whatsappHref = (() => {
    const phone = texts?.contact?.phone;
    if (!phone) return '';
    const normalized = phone.replace(/\D/g, '');
    return normalized ? `https://wa.me/${normalized}` : '';
  })();

  const mailHref = texts?.contact?.email ? `mailto:${texts.contact.email}` : '';

  const hasQuickActions = Boolean(mailHref || telHref || whatsappHref);

  return (
    <section className={styles.contactSection}>
      <div className={`${styles.contactCard} v2-card v2-card--neutral`}>
        <CompanyContact
          contact={texts.contact}
          schedule={client.operations.schedule}
          locale={locale}
          hoursStatus={texts.hoursStatus}
          ariaLabel={ariaTexts?.info || 'Contact information'}
          emailAriaLabel={ariaTexts?.email || 'Send email'}
          phoneAriaLabel={ariaTexts?.call || 'Call phone number'}
          className={styles.contact}
          headingAs="h3"
          headingClassName={`${styles.contactTitle} type-title-sm`}
        />
      </div>
      {hasQuickActions && (
        <nav
          className={styles.quickActions}
          aria-label={ariaTexts?.quickActions || 'Quick contact actions'}
        >
          <div className={styles.actionList}>
            {telHref && (
              <a
                className={styles.actionLink}
                href={telHref}
                aria-label={ariaTexts?.call || 'Call phone number'}
              >
                <Image
                  src="/images/phone.png"
                  alt=""
                  width={92}
                  height={92}
                  className={styles.actionImage}
                  aria-hidden="true"
                />
                <span className={styles.srOnly}>{quickTexts?.call || 'Call'}</span>
              </a>
            )}
            {mailHref && (
              <a
                className={styles.actionLink}
                href={mailHref}
                aria-label={ariaTexts?.email || 'Send email'}
              >
                <Image
                  src="/images/mail.png"
                  alt=""
                  width={92}
                  height={92}
                  className={styles.actionImage}
                  aria-hidden="true"
                />
                <span className={styles.srOnly}>{quickTexts?.email || 'Email'}</span>
              </a>
            )}
            {whatsappHref && (
              <a
                className={styles.actionLink}
                href={whatsappHref}
                aria-label={ariaTexts?.whatsapp || 'Open WhatsApp chat'}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/images/whatsapp.png"
                  alt=""
                  width={92}
                  height={92}
                  className={styles.actionImage}
                  aria-hidden="true"
                />
                <span className={styles.srOnly}>{quickTexts?.whatsapp || 'WhatsApp'}</span>
              </a>
            )}
          </div>
        </nav>
      )}
    </section>
  );
}
