import styles from './Loading.module.css';
import Image from 'next/image';

export interface LoadingData {
  theme: 'light' | 'dark';
}

const Loading: React.FC<LoadingData> = ({ theme }) => {
  return (
    <main className={styles.loadingContainer} role="status" aria-live="polite" aria-busy="true">
      <aside className={styles.loadingWrapper} aria-hidden="true">
        <div className={styles.spinner} />
      </aside>
      <div className={styles.logoWrapper}>
        <Image
          src={'/logos/logo-dark.webp'}
          alt="Havenova Logo"
          width={200}
          height={50}
          className={styles.logo}
          priority={true}
          fetchPriority="auto"
        />
      </div>

      <p className={styles.visuallyHidden}>Loading…</p>
    </main>
  );
};
export default Loading;
