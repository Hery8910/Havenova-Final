'use client';
import { useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { useClient, useCookies, useI18n } from '../../../contexts';
import { useAuth } from '../../../contexts/auth/authContext';
import { href } from '../../../utils';
import type { FooterHoursStatusCopy } from './BusinessHoursStatus';
import { getNavbarContent } from '../navbar/navbar.shared';
import type { NavbarConfig } from '../navbar/navbar.types';
import { CompanyContact } from '../companyContact';

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

interface FooterA11y {
  landmark?: string;
  home?: string;
  contact?: string;
  navigation?: string;
  hours?: string;
  cookies?: string;
  email?: string;
  phone?: string;
  address?: string;
  developer?: string;
}

export interface FooterProps {
  headers: HeadersItem;
  contact: {
    title?: string;
    email: string;
    phone: string;
    address: string;
  };
  hour: { week: WeekItem; weekend: WeekItem };
  links: LinkItem[];
  legal: LegalItem[];
  social: SocialItem[];
  cta: CtaItem;
  a11y?: FooterA11y;
  hoursStatus?: FooterHoursStatusCopy;
}

export interface FooterViewProps {
  footer: FooterProps;
  onOpenCookies: () => void;
}

export function Footer() {
  const { texts, language } = useI18n();
  const { client } = useClient();
  const { auth } = useAuth();
  const { openManager } = useCookies();
  const aboutHeadingId = useId();
  const legalHeadingId = useId();
  const userHeadingId = useId();

  const footer = texts?.components?.client?.footer as FooterProps | undefined;
  const navbarConfig: NavbarConfig | undefined = texts?.components?.client?.navbar;

  if (!footer) return null;

  const a11y = footer.a11y ?? {};
  const navbarContent = getNavbarContent({
    texts,
    navbarConfig,
    auth,
  });
  const userSectionTitle = auth.isLogged
    ? navbarContent.labels.profile
    : navbarContent.labels.account;

  return (
    <footer className={styles.footer} aria-label={a11y.landmark}>
      <div className={`${styles.content} container`}>
        <header className={styles.header} aria-label={a11y.contact}>
          <Link className={styles.logoLink} href={href(language, '/')} aria-label={a11y.home}>
            <Image
              className={styles.logoImage}
              src="/logos/logo-dark.webp"
              alt=""
              width={200}
              height={50}
              priority
            />
          </Link>
          <CompanyContact
            contact={footer.contact}
            schedule={client.operations.schedule}
            hoursStatus={footer.hoursStatus}
            ariaLabel={a11y.contact}
            emailAriaLabel={a11y.email}
            phoneAriaLabel={a11y.phone}
            className={styles.contact}
            headingClassName={`${styles.sectionHeading} type-title-md`}
          />
        </header>
        <nav className={styles.links} aria-label={a11y.navigation}>
          <section className={styles.linkGroup}>
            <h2 className={`${styles.linkHeading} type-title-md`} id={aboutHeadingId}>
              {footer.headers.about}
            </h2>
            <ul className={styles.linkList} aria-labelledby={aboutHeadingId}>
              {footer.links.map((elem) => (
                <li key={elem.href} className={styles.linkItem}>
                  <Link
                    className={`button button--ghost ${styles.footerButton}`}
                    href={href(language, elem.href)}
                  >
                    {elem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.linkGroup}>
            <h2 className={`${styles.linkHeading} type-title-md`} id={legalHeadingId}>
              {footer.headers.legal}
            </h2>
            <ul className={styles.linkList} aria-labelledby={legalHeadingId}>
              {footer.legal.map((elem) => (
                <li key={elem.href} className={styles.linkItem}>
                  <Link
                    className={`button button--ghost ${styles.footerButton}`}
                    href={href(language, elem.href)}
                  >
                    {elem.label}
                  </Link>
                </li>
              ))}
              <li className={styles.linkItem}>
                <button
                  className={`button button--ghost ${styles.footerButton}`}
                  type="button"
                  onClick={openManager}
                  aria-label={a11y.cookies}
                >
                  {footer.cta.cookies}
                </button>
              </li>
            </ul>
          </section>
          <section className={styles.linkGroup}>
            <h2 className={`${styles.linkHeading} type-title-md`} id={userHeadingId}>
              {userSectionTitle}
            </h2>
            <ul className={styles.linkList} aria-labelledby={userHeadingId}>
              {navbarContent.userLinks.map((item) => (
                <li key={item.href} className={styles.linkItem}>
                  <Link
                    className={`button button--ghost ${styles.footerButton}`}
                    href={href(language, item.href)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </nav>
      </div>
      <aside className={styles.support}>
        <Link
          href="/#"
          className={`button button--ghost ${styles.supportLink}`}
          aria-label={a11y.developer}
        >
          <Image
            className={styles.supportLogo}
            src="/svg/maped.svg"
            alt=""
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
