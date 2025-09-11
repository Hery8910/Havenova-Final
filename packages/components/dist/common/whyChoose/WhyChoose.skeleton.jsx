// src/components/WhyChoose.skeleton.tsx
import styles from './WhyChoose.module.css';
export default function SkeletonWhyChoose() {
    const items = Array.from({ length: 4 });
    return (<section className={styles.section} aria-busy="true" aria-live="polite">
      <header className={styles.header}>
        <div className={`${styles.skelH2} ${styles.animShimmer}`}/>
        <div className={`${styles.skelP} ${styles.animShimmer}`}/>
      </header>

      <ul className={styles.ul} aria-hidden="true">
        {items.map((_, i) => (<li className={styles.li} key={i}>
            <div className={`${styles.skelIcon} ${styles.animShimmer}`}/>
            <div className={`${styles.skelH3} ${styles.animShimmer}`}/>
          </li>))}
      </ul>
    </section>);
}
