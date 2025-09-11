// src/components/ServicesPreview.tsx
import React from 'react';
import styles from './ServicesPreview.module.css';
import Image from 'next/image';
import Link from 'next/link';

export interface ServicesPreviewItems {
  title: string;
  image: { src: string };
}
export interface ServicesPreviewData {
  title: string;
  subtitle: string;
  description: string;
  items: ServicesPreviewItems[];
  cta: { label: string; href: string };
  theme: 'light' | 'dark';
}

const ServicesPreview: React.FC<ServicesPreviewData> = ({
  title,
  subtitle,
  description,
  items,
  cta,
  theme,
}) => {
  const bgSrc =
    theme === 'dark'
      ? '/svg/background/service-background-light.svg'
      : '/svg/background/service-background-dark.svg';

  return (
    <section className={styles.section} aria-labelledby="servicespreview-title">
      <div className={styles.bgWrapper} aria-hidden="true">
        <Image
          src={bgSrc}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          fetchPriority="auto"
          className={styles.backgroundImage}
        />
      </div>

      <h2 id="servicespreview-title" className={styles.h2}>
        {title}
      </h2>
      <h3 className={styles.h3}>{subtitle}</h3>

      <ul className={styles.ul}>
        {items.map((item, idx) => (
          <li className={styles.li} key={`${idx}-${item.title}`}>
            <figure className={styles.figure}>
              <Image
                className={styles.icon}
                src={item.image.src}
                alt=""
                width={100}
                height={100}
                loading="lazy"
                decoding="async"
                sizes="100px"
              />
            </figure>
            <h4 className={styles.h4}>{item.title}</h4>
          </li>
        ))}
      </ul>

      <p className={styles.p}>{description}</p>

      <Link href={cta.href} className="button" aria-label={`${cta.label} – gehe zu ${cta.href}`}>
        {cta.label}
      </Link>
    </section>
  );
};

export default ServicesPreview;
