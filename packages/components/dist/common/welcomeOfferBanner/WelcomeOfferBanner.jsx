// src/components/WelcomeOfferBanner.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './WelcomeOfferBanner.module.css';
const WelcomeOfferBanner = ({ header, description, cta, image, priorityOnFirstViewport = false, }) => {
    return (<section className={styles.section} aria-labelledby="offer-banner-title" aria-describedby="offer-banner-desc">
      <figure className={styles.figure}>
        <Image className={styles.image} src={image.src} alt={image.alt} width={500} height={500} sizes="(min-width: 1025px) 450px, 300px" priority={priorityOnFirstViewport} fetchPriority={priorityOnFirstViewport ? 'high' : 'auto'}/>
      </figure>

      <div className={styles.main}>
        <h2 id="offer-banner-title" className={styles.h2}>
          {header}
        </h2>
        <p id="offer-banner-desc" className={styles.p}>
          {description}
        </p>
        <Link href={cta.href} className="button" aria-label={`${cta.label} – gehe zu ${cta.href}`}>
          {cta.label}
        </Link>
      </div>
    </section>);
};
export default WelcomeOfferBanner;
