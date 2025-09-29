import styles from './Loading.module.css';
import Image from 'next/image';

export interface LoadingData {
  theme: 'light' | 'dark';
}

const Loading: React.FC<LoadingData> = ({ theme }) => {
  const backgroundImage =
    theme === 'dark' ? '/images/logos/logo-small-dark.webp' : '/images/logos/logo-small-light.webp';

  return (
    <main className={`${styles.loadingContainer} card`}>
      <div className={styles.wrapper}>
        <Image
          src={backgroundImage}
          alt="Havenova Logo"
          width={200}
          height={200}
          className={styles.logo}
          priority={true}
          fetchPriority="auto"
        />
        <ul className={styles.ul}>
          <li className={styles.dot} />
          <li className={styles.dot} />
          <li className={styles.dot} />
          <li className={styles.dot} />
        </ul>
      </div>
    </main>
  );
};
export default Loading;
