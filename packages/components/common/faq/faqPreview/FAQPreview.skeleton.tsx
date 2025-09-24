import styles from './FAQPreview.module.css';

const FAQPreviewSkeleton = () => (
  <ul className={styles.ul} aria-hidden="true">
    {Array.from({ length: 3 }).map((_, i) => (
      <li key={i} className={styles.li}>
        <div className={styles.skeletonQuestion}></div>
        <div className={styles.skeletonAnswer}></div>
        <div className={styles.skeletonAnswer}></div>
      </li>
    ))}
  </ul>
);

export default FAQPreviewSkeleton;
