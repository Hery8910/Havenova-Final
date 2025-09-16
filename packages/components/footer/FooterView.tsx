import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

interface HeadersItem {
  services: string;
  about: string;
  contact: string;
  legal: string;
}
interface ContactItem {
  label: string;
  data: string;
  image: string;
}

interface HavenovaItem {
  label: string;
  href: string;
}
interface ServicesItem {
  label: string;
  href: string;
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
}

export interface FooterProps {
  headers: HeadersItem;
  contact: ContactItem[];
  havenova: HavenovaItem[];
  services: ServicesItem[];
  legal: LegalItem[];
  social: SocialItem[];
  cta: CtaItem;
}

export interface FooterViewProps {
  footer: FooterProps;
  onOpenCookies: () => void;
}

export function FooterView({ footer, onOpenCookies }: FooterViewProps) {
  return (
    <footer className={styles.footer} aria-label="Website footer">
      <header className={styles.header}>
        <Link className={styles.logo} href="/" aria-label="Go to homepage">
          <Image
            className={styles.logo}
            src="/images/logos/logo-dark.webp"
            alt="Havenova Logo"
            width={200}
            height={50}
            priority
          />
        </Link>

        <ul className={styles.header_ul} aria-label="Contact information">
          <h3 className={styles.h3}>{footer?.headers?.contact}</h3>
          {footer.contact.map((elem, index) => (
            <li key={index} className={styles.contact_li}>
              {elem.image ? (
                <Image
                  className={styles.image}
                  src={elem.image}
                  alt={`${elem.label} icon`}
                  width={25}
                  height={25}
                />
              ) : (
                <span>{elem.label}</span>
              )}
              <p>{elem.data}</p>
            </li>
          ))}
        </ul>
      </header>

      <ul className={styles.main_ul}>
        <li className={styles.main_li}>
          <h3 className={styles.h3}>{footer?.headers?.about}</h3>
          <ul className={styles.ul} aria-label="About Havenova">
            {footer.havenova.map((elem, index) => (
              <li key={index} className={styles.li}>
                <Link href={elem.href}>{elem.label}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles.main_li}>
          <h3 className={styles.h3}>{footer?.headers?.services}</h3>
          <ul className={styles.ul} aria-label="Our services">
            {footer.services.map((elem, index) => (
              <li key={index} className={styles.li}>
                <Link href={elem.href}>{elem.label}</Link>
              </li>
            ))}
          </ul>
        </li>
        <li className={styles.main_li}>
          <h3 className={styles.h3}>{footer?.headers?.legal}</h3>
          <ul className={styles.ul} aria-label={footer?.headers?.legal}>
            {footer.legal.map((elem, index) => (
              <li key={index} className={styles.li}>
                <Link href={elem.href}>{elem.label}</Link>
              </li>
            ))}
            <li className={styles.li}>
              <button
                className={styles.cookie_button}
                onClick={onOpenCookies}
                aria-label="Open cookie preferences"
              >
                Cookies Preference
              </button>
            </li>
          </ul>
        </li>
        <li className={styles.main_li}>
          <Link href={'/#'} className={styles.link_maped}>
            <Image
              className={styles.logo_maped}
              src="/svg/maped.svg"
              alt="Maped Solutions Logo"
              width={50}
              height={25}
              priority
            />
            {footer.cta.title}
          </Link>
          <p className={styles.cta}>{footer.cta.description}</p>
        </li>
      </ul>
    </footer>
  );
}
