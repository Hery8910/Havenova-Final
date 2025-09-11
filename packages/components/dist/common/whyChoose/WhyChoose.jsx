// src/components/WhyChoose.tsx
import React from 'react';
import styles from './WhyChoose.module.css';
import Image from 'next/image';
const WhyChoose = ({ title, description, points }) => {
    return (<section className={styles.section} aria-labelledby="why-choose-title" aria-describedby="why-choose-desc">
      <header className={styles.header}>
        <h2 id="why-choose-title" className={styles.h2}>
          {title}
        </h2>
        <p id="why-choose-desc" className={styles.desc}>
          {description}
        </p>
      </header>

      <ul className={styles.ul}>
        {points.map((point) => (<li className={styles.li} key={point.title}>
            <figure className={styles.figure} aria-hidden="true">
              <Image className={styles.icon} src={point.image.src} alt="" width={80} height={80} loading="lazy" decoding="async" sizes="80px"/>
            </figure>
            <h3 className={styles.h3}>{point.title}</h3>
          </li>))}
      </ul>
    </section>);
};
export default WhyChoose;
