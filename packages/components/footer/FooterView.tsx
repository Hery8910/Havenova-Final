import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

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

export interface FooterProps {
  contact: ContactItem[];
  havenova: HavenovaItem[];
  services: ServicesItem[];
  legal: LegalItem[];
  social: SocialItem[];
  cta: string;
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
            src="/svg/logo-white.svg"
            alt="Havenova Logo"
            width={350}
            height={150}
          />
        </Link>

        <ul className={styles.ul} aria-label="Contact information">
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

      <main className={styles.main}>
        <ul className={styles.ul} aria-label="About Havenova">
          {footer.havenova.map((elem, index) => (
            <li key={index} className={styles.li}>
              <Link href={elem.href}>{elem.label}</Link>
            </li>
          ))}
        </ul>

        <ul className={styles.ul} aria-label="Our services">
          {footer.services.map((elem, index) => (
            <li key={index} className={styles.li}>
              <Link href={elem.href}>{elem.label}</Link>
            </li>
          ))}
        </ul>

        <ul className={styles.ul} aria-label="Legal information">
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
      </main>

      <p className={styles.cta}>
        {footer.cta} - <strong>Havenova</strong>. Powered by{' '}
        <Link href={'/#'}>
          <strong>Maped Solutions</strong>.
        </Link>
      </p>
    </footer>
  );
}
