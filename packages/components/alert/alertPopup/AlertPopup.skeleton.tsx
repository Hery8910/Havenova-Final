import styles from './AlertPopup.module.css';

const AlertSkeleton: React.FC = () => {
  return (
    <section className={`${styles.section} card`}>
      <div className={styles.wraper}>
        <main className={`${styles.main} skeleton`} />
        <div className={styles.article}>
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-text" />
        </div>
      </div>
    </section>
  );
};

export default AlertSkeleton;
