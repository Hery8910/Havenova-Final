'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useCookies, useI18n } from '../../../contexts';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';

interface HeadersItem {
  services?: string;
  about?: string;
  contact?: string;
  legal?: string;
}
interface WeekItem {
  label?: string;
  data: string;
}

interface LinkItem {
  label: string;
  href: string;
  tone?: string;
}
interface LegalItem {
  label: string;
  href: string;
}
interface SocialItem {
  label: string;
  href: string;
}
interface CtaItem {
  title: string;
  description: string;
  cookies: string;
}

export interface FooterProps {
  headers: HeadersItem;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  hour: { week: WeekItem; weekend: WeekItem };
  links: LinkItem[];
  legal: LegalItem[];
  social: SocialItem[];
  cta: CtaItem;
}

export interface FooterViewProps {
  footer: FooterProps;
  onOpenCookies: () => void;
}

export function Footer() {
  const { texts } = useI18n();
  const { openManager } = useCookies();

  const footer = texts?.components?.client?.footer as FooterProps | undefined;

  if (!footer) return null;

  return (
    <footer className={styles.footer} aria-label="Website footer">
      <Link className={styles.logoLink} href="/" aria-label="Go to homepage">
        <Image
          className={styles.logoImage}
          src="/logos/nav-logo-dark.webp"
          alt="Havenova Logo"
          width={150}
          height={50}
          priority
        />
      </Link>
      <div className={`${styles.content} container`}>
        <address className={styles.contact} aria-label="Contact information">
          <ul className={styles.contactList}>
            <li className={styles.contactItem} key={'1'}>
              <span className={styles.contactIcon}>
                <LuMail />
              </span>
              <p className={styles.contactLabel}>{footer?.contact?.email}</p>
            </li>
            <li className={styles.contactItem} key={'2'}>
              <span className={styles.contactIcon}>
                <LuPhone />
              </span>
              <p className={styles.contactLabel}>{footer?.contact?.phone}</p>
            </li>
            <li className={styles.contactItem} key={'3'}>
              <span className={styles.contactIcon}>
                <LuMapPin />
              </span>
              <p className={styles.contactLabel}>{footer?.contact?.address}</p>
            </li>
            <li className={styles.contactItem} key={'4'}>
              <p className={styles.contactLabel}>{footer?.hour?.week.label}</p>
              <p className={styles.contactLabel}>{footer?.hour?.week.data}</p>
            </li>
            <li className={styles.contactItem} key={'5'}>
              <p className={styles.contactLabel}>{footer?.hour?.weekend.label}</p>
              <p className={styles.contactLabel}>{footer?.hour?.weekend.data}</p>
            </li>
          </ul>
        </address>
        <nav className={styles.links} aria-label="Footer links">
          <section className={styles.linkGroup}>
            <h4 className={styles.linkHeading} id="footer-about">
              {footer?.headers?.about}
            </h4>
            <ul className={styles.linkList} aria-labelledby="footer-about">
              {footer.links.map((elem, index) => (
                <li key={index} className={styles.linkItem}>
                  <Link className={styles.footerLink} href={elem.href}>
                    {elem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.linkGroup}>
            <h4 className={styles.linkHeading} id="footer-legal">
              {footer?.headers?.legal}
            </h4>
            <ul className={styles.linkList} aria-labelledby="footer-legal">
              {footer.legal.map((elem, index) => (
                <li key={index} className={styles.linkItem}>
                  <Link className={styles.footerLink} href={elem.href}>
                    {elem.label}
                  </Link>
                </li>
              ))}
              <li className={styles.linkItem}>
                <button
                  className={styles.footerLink}
                  type="button"
                  onClick={openManager}
                  aria-label="Open cookie preferences"
                >
                  {footer.cta.cookies}
                </button>
              </li>
            </ul>
          </section>
        </nav>
      </div>
      <aside className={styles.support}>
        <Link href="/#" className={styles.supportLink}>
          <Image
            className={styles.supportLogo}
            src="/svg/maped.svg"
            alt="Maped Solutions Logo"
            width={50}
            height={25}
            priority
          />
          {footer.cta.title}
        </Link>
        <p className={styles.supportText}>{footer.cta.description}</p>
      </aside>
    </footer>
  );
}
