import Image from 'next/image';
import styles from './Avatar.module.css';

export interface AvatarViewProps {
  name: string;
  profileImage: string;
  onNavigate: () => void;
}

export function AvatarView({ name, profileImage, onNavigate }: AvatarViewProps) {
  return (
    <section className={styles.section}>
      <button
        onClick={onNavigate}
        className={styles.button}
        aria-label={`Go to profile of ${name}`}
      >
        <Image
          className={styles.image}
          src={profileImage}
          alt={`${name}'s profile picture`}
          width={40}
          height={40}
        />
        <span className={styles.name}>{name}</span>
      </button>
    </section>
  );
}
