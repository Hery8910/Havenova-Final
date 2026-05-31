'use client';

import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import styles from './NavbarProfileTrigger.module.css';

interface NavbarProfileTriggerProps {
  avatarSrc?: string;
  alt: string;
  fallbackLabel: string;
}

export function NavbarProfileTrigger({
  avatarSrc,
  alt,
  fallbackLabel,
}: NavbarProfileTriggerProps) {
  if (avatarSrc) {
    return (
      <span className={styles.avatarShell} aria-hidden="true">
        <Image className={styles.avatarImage} src={avatarSrc} alt={alt} width={34} height={34} />
      </span>
    );
  }

  return (
    <>
      <CgProfile aria-hidden />
      <span className="sr-only">{fallbackLabel}</span>
    </>
  );
}
