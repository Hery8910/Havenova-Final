// src/components/HomeHero.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomeHero.module.css';
const HomeHero = ({ headline1, headline2, subtitle, cta, image, priorityOnFirstViewport = true, }) => {
    return (<section className={styles.section} aria-labelledby="home-hero-title">
      {/* Fondo decorativo optimizado */}
      <div className={styles.bgWrapper}>
        <Image src={image} alt="" // decorativo
     fill sizes="100vw" priority={priorityOnFirstViewport} fetchPriority={priorityOnFirstViewport ? 'high' : 'auto'} className={styles.backgroundImage} quality={75} // opcional: ajusta si lo necesitas
    />
      </div>

      <div className={styles.main}>
        <aside className={styles.aside}>
          <div className={styles.div}>
            <h1 id="home-hero-title" className={styles.h1}>
              <span className={styles.h1Line}>{headline1}</span>
              <span className={styles.h1Line}>{headline2}</span>
            </h1>
          </div>
          <p className={styles.p} aria-hidden="true">
            &
          </p>
        </aside>

        <p className={styles.description}>{subtitle}</p>

        <Link href={cta.href} className="button" aria-label={`${cta.label} – gehe zu ${cta.href}`}>
          {cta.label}
        </Link>
      </div>
    </section>);
};
export default HomeHero;
