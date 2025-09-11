'use client';
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../contexts/I18nContext';
import { useCookies } from '../../contexts/CookiesContext';
const Footer = () => {
    const { texts } = useI18n();
    const { openManager } = useCookies();
    const footer = texts.footer;
    return (<footer className={styles.footer}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/">
          <Image className={styles.logo} src="/svg/logo-white.svg" alt="Havenova Logo" width={350} height={150}/>
        </Link>
        <ul className={styles.ul}>
          {footer.contact.map((elem, index) => (<li key={index} className={styles.contact_li}>
              {elem.image ? (<Image className={styles.image} src={elem.image} alt="Icon" width={25} height={25}/>) : (<p>{elem.label}</p>)}

              <p>{elem.data}</p>
            </li>))}
        </ul>
      </header>
      <main className={styles.main}>
        <ul className={styles.ul}>
          {footer.havenova.map((elem, index) => (<li key={index} className={styles.li}>
              <Link href={elem.href}>
                <p>{elem.label}</p>
              </Link>
            </li>))}
        </ul>

        <ul className={styles.ul}>
          {footer.services.map((elem, index) => (<li key={index} className={styles.li}>
              <Link href={elem.href}>
                <p>{elem.label}</p>
              </Link>
            </li>))}
        </ul>

        <ul className={styles.ul}>
          {footer.legal.map((elem, index) => (<li key={index} className={styles.li}>
              <Link href={elem.href}>
                <p>{elem.label}</p>
              </Link>
            </li>))}
          <li className={styles.li}>
            <button className={styles.cookie_button} onClick={openManager}>
              Cookies Preference
            </button>
          </li>
        </ul>
      </main>
      <p className={styles.cta}>
        2025 - <strong>Havenova</strong>. Powered by{' '}
        <Link href={'/#'}>
          <strong>Maped Solutions</strong>.
        </Link>
      </p>
    </footer>);
};
export default Footer;
