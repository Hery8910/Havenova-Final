// src/components/ServicesPreview.skeleton.tsx
import styles from './ServicesPreview.module.css';
export default function SkeletonServicesPreview() {
    const items = Array.from({ length: 6 });
    return (<section className={styles.section} aria-busy="true" aria-live="polite">
      <div className={styles.bgWrapper} aria-hidden="true">
        <div className={`${styles.backgroundImage} ${styles.skelBg}`}/>
        <div className={styles.bgOverlay}/>
      </div>

      <div className={`${styles.skelH2} ${styles.animShimmer}`}/>
      <div className={`${styles.skelH3} ${styles.animShimmer}`}/>

      <ul className={styles.ul} aria-hidden="true">
        {items.map((_, i) => (<li className={styles.li} key={i}>
            <div className={`${styles.skelIcon} ${styles.animShimmer}`}/>
            <div className={`${styles.skelH4} ${styles.animShimmer}`}/>
          </li>))}
      </ul>

      <div className={`${styles.skelDesc} ${styles.animShimmer}`}/>
      <div className={`${styles.skelBtn} ${styles.animShimmer}`} role="presentation"/>
    </section>);
}
