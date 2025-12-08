import styles from './Loading.module.css';
import Image from 'next/image';

export interface LoadingData {
  theme: 'light' | 'dark';
}

const Loading: React.FC<LoadingData> = ({ theme }) => {
  const backgroundImage =
    theme === 'dark' ? '/images/logos/logo-dark.webp' : '/images/logos/logo-light.webp';

  return (
    <main className={styles.loadingContainer}>
      <div className={styles.logoWrapper}>
        <Image
          src={backgroundImage}
          alt="Havenova Logo"
          width={400}
          height={100}
          className={styles.logo}
          priority={true}
          fetchPriority="auto"
        />
      </div>
      <aside className={styles.progressBar}>
        <span className={styles.progressFill}></span>
      </aside>
    </main>
  );
};
export default Loading;
