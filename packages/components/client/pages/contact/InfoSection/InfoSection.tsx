import styles from './InfoSection.module.css';
import Image from 'next/image';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';
import { useI18n } from '../../../../../contexts';

interface WeekItem {
  label?: string;
  data: string;
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
  const contactTexts = i18nTexts?.components?.client?.contact;
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
        className={`${styles.contact} card--glass`}
        aria-label={ariaTexts?.info || 'Contact information'}
      >
        <h3 className={styles.contactTitle}>{texts?.contact?.title}</h3>
        <ul className={styles.contactList}>
          <li className={styles.contactItem} key={'1'}>
            <span className={styles.contactIcon}>
              <LuMail />
            </span>
            <p className={styles.contactLabel}>{texts?.contact?.email}</p>
          </li>
          <li className={styles.contactItem} key={'2'}>
            <span className={styles.contactIcon}>
              <LuPhone />
            </span>
            <p className={styles.contactLabel}>{texts?.contact?.phone}</p>
          </li>
          <li className={styles.contactItem} key={'3'}>
            <span className={styles.contactIcon}>
              <LuMapPin />
            </span>
            <p className={styles.contactLabel}>{texts?.contact?.address}</p>
          </li>
          <li className={styles.contactItem} key={'4'}>
            <p className={styles.contactLabel}>{texts?.hour?.week.label}</p>
            <p className={styles.contactLabel}>{texts?.hour?.week.data}</p>
          </li>
          <li className={styles.contactItem} key={'5'}>
            <p className={styles.contactLabel}>{texts?.hour?.weekend.label}</p>
            <p className={styles.contactLabel}>{texts?.hour?.weekend.data}</p>
          </li>
        </ul>
      </address>
      {hasQuickActions && (
        <article
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
        </article>
      )}
    </section>
  );
}
