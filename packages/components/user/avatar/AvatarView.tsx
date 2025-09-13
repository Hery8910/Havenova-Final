import Image from 'next/image';
import styles from './Avatar.module.css';

export interface AvatarViewProps {
  name: string;
  profileImage: string;
  isMobile: boolean;
  onNavigate: () => void;
}

export function AvatarView({ name, profileImage, isMobile, onNavigate }: AvatarViewProps) {
  return (
    <section className={styles.section}>
      <button
        onClick={onNavigate}
        className={`${styles.button} ${isMobile ? styles.mobile : ''}`}
        aria-label={`Go to profile of ${name}`}
      >
        <Image
          className={styles.image}
          src={profileImage}
          alt={`${name}'s profile picture`}
          width={40}
          height={40}
        />
        {!isMobile && <p>{name}</p>}
      </button>
    </section>
  );
}
