import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './authShell.module.css';

interface AuthPageShellProps {
  headingId: string;
  descriptionId: string;
  title: string;
  description: string;
  homeHref: string;
  homeLabel: string;
  logoAlt: string;
  footerLabel?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthPageShell({
  headingId,
  descriptionId,
  title,
  description,
  homeHref,
  homeLabel,
  logoAlt,
  footerLabel,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <article
      className={`${styles.authSection} card card--primary`}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <Link className={styles.authBrand} href={homeHref} aria-label={homeLabel}>
        <Image
          className={styles.authBrandImage}
          src="/shared/logos/logo-small-dark.webp"
          alt={logoAlt}
          width={80}
          height={80}
          priority
        />
      </Link>
      <div className={styles.authFormContainer}>
        <header className={styles.authHeader}>
          <h1 id={headingId} className={styles.authTitle}>
            {title}
          </h1>
          <p id={descriptionId} className={styles.authDescription}>
            {description}
          </p>
        </header>

        {children}
      </div>
      {footer ? (
        <footer className={styles.authFooter}>
          <nav aria-label={footerLabel}>{footer}</nav>
        </footer>
      ) : null}
    </article>
  );
}
