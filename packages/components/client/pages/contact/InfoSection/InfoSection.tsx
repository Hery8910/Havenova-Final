'use client';

import styles from './InfoSection.module.css';
import Image from 'next/image';
import { useClient } from '../../../../../contexts';
import { CompanyContact } from '../../../companyContact';
import type { ContactInfoTexts } from '../contact.types';

interface QuickActionItem {
  key: 'call' | 'email' | 'whatsapp';
  href: string;
  ariaLabel: string;
  srLabel: string;
  imageSrc: string;
  external?: boolean;
}

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
  const quickActions: QuickActionItem[] = [
    telHref
      ? {
          key: 'call',
          href: telHref,
          ariaLabel: ariaTexts?.call || 'Call phone number',
          srLabel: quickTexts?.call || 'Call',
          imageSrc: '/images/phone.png',
        }
      : null,
    mailHref
      ? {
          key: 'email',
          href: mailHref,
          ariaLabel: ariaTexts?.email || 'Send email',
          srLabel: quickTexts?.email || 'Email',
          imageSrc: '/images/mail.png',
        }
      : null,
    whatsappHref
      ? {
          key: 'whatsapp',
          href: whatsappHref,
          ariaLabel: ariaTexts?.whatsapp || 'Open WhatsApp chat',
          srLabel: quickTexts?.whatsapp || 'WhatsApp',
          imageSrc: '/images/whatsapp.png',
          external: true,
        }
      : null,
  ].filter(Boolean) as QuickActionItem[];

  return (
    <section className={styles.contactSection}>
      <div className={`${styles.contactCard} card card--neutral`}>
        <CompanyContact
          contact={texts.contact}
          schedule={client.operations.schedule}
          locale={locale}
          hoursStatus={texts.hoursStatus}
          ariaLabel={ariaTexts?.info || 'Contact information'}
          emailAriaLabel={ariaTexts?.email || 'Send email'}
          phoneAriaLabel={ariaTexts?.call || 'Call phone number'}
          addressAriaLabel={ariaTexts?.address || 'Open address in Google Maps'}
          className={styles.contact}
        />
      </div>
      {quickActions.length > 0 && (
        <nav
          className={styles.quickActions}
          aria-label={ariaTexts?.quickActions || 'Quick contact actions'}
        >
          <div className={styles.actionList}>
            {quickActions.map((action) => (
              <a
                key={action.key}
                className={`${styles.actionLink} button button--ghost`}
                href={action.href}
                aria-label={action.ariaLabel}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noreferrer' : undefined}
              >
                <Image
                  src={action.imageSrc}
                  alt=""
                  width={92}
                  height={92}
                  className={styles.actionImage}
                  aria-hidden="true"
                />
                <span className={styles.srOnly}>{action.srLabel}</span>
              </a>
            ))}
          </div>
        </nav>
      )}
    </section>
  );
}
