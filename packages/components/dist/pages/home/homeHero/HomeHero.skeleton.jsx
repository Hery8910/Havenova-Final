// src/components/HomeHero.skeleton.tsx
import styles from './HomeHero.module.css';
const HomeHeroSkeleton = () => {
    return (<section className={styles.section} aria-busy="true" aria-live="polite">
      <div className={`${styles.fakeBackground} ${styles.animShimmer}`}/>

      <div className={styles.main}>
        <aside className={styles.aside}>
          <div className={styles.div}>
            <div className={`${styles.skeletonText} ${styles.animShimmer}`}/>
            <div className={`${styles.skeletonText} ${styles.animShimmer}`}/>
          </div>
          <div className={`${styles.skeletonCircle} ${styles.animShimmer}`}/>
        </aside>

        <div className={`${styles.skeletonSubtitle} ${styles.animShimmer}`}/>
        <div className={`${styles.skeletonButton} ${styles.animShimmer}`} role="presentation"/>
      </div>
    </section>);
};
export default HomeHeroSkeleton;
