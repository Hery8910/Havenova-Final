import styles from './InfoSection.module.css';
import Image from 'next/image';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { useI18n } from '../../../../../contexts';

interface WeekItem {
  label?: string;
  data: string;
}

interface ContactInfoAriaTexts {
  info: string;
  quickActions: string;
  call: string;
  email: string;
  whatsapp: string;
}

interface ContactQuickActionTexts {
  call: string;
  email: string;
  whatsapp: string;
}

export default function InfoSection({
  texts,
}: {
  texts: {
    contact: {
      title: string;
      email: string;
      phone: string;
      address: string;
    };
    hour: { week: WeekItem; weekend: WeekItem };
  };
}) {
  const { texts: i18nTexts } = useI18n();
  const contactTexts = i18nTexts?.components?.client?.contact as
    | {
        aria?: ContactInfoAriaTexts;
        quickActions?: ContactQuickActionTexts;
      }
    | undefined;
  const ariaTexts = contactTexts?.aria;
  const quickTexts = contactTexts?.quickActions;

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
      <address
        className={`${styles.contact} glass-panel--base`}
        aria-label={ariaTexts?.info || 'Contact information'}
      >
        <h3 className={`${styles.contactTitle} type-title-sm`}>{texts?.contact?.title}</h3>
        <ul className={styles.contactList}>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuMail />
            </span>
            <a className={`${styles.contactLink} type-body-sm`} href={mailHref}>
              {texts?.contact?.email}
            </a>
          </li>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuPhone />
            </span>
            <a className={`${styles.contactLink} type-body-sm`} href={telHref}>
              {texts?.contact?.phone}
            </a>
          </li>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true">
              <LuMapPin />
            </span>
            <p className={`${styles.contactLabel} type-body-sm`}>{texts?.contact?.address}</p>
          </li>
          <li className={styles.contactItem}>
            <p className={`${styles.contactLabel} type-body-sm`}>{texts?.hour?.week.label}</p>
            <p className={`${styles.contactLabel} type-body-sm`}>{texts?.hour?.week.data}</p>
          </li>
          <li className={styles.contactItem}>
            <p className={`${styles.contactLabel} type-body-sm`}>{texts?.hour?.weekend.label}</p>
            <p className={`${styles.contactLabel} type-body-sm`}>{texts?.hour?.weekend.data}</p>
          </li>
        </ul>
      </address>
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
