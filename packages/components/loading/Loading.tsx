import styles from './Loading.module.css';
import Image from 'next/image';

export interface LoadingData {
  theme: 'light' | 'dark';
}

const Loading: React.FC<LoadingData> = ({ theme }) => {
  const backgroundImage =
    theme === 'light' ? '/images/logos/nav-logo-dark.webp' : '/images/logos/nav-logo-light.webp';

  return (
    <main className={styles.loadingContainer} role="status" aria-live="polite" aria-busy="true">
      <aside className={styles.loadingWrapper} aria-hidden="true">
        <div className={styles.spinner} />
      </aside>
      <div className={styles.logoWrapper}>
        <Image
          src={backgroundImage}
          alt="Havenova Logo"
          width={300}
          height={75}
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
