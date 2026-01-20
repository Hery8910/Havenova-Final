'use client';

import { GoDotFill } from 'react-icons/go';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  label: string | undefined;
  isActive: boolean | undefined;
}

const StatusBadge = ({ label, isActive }: StatusBadgeProps) => (
  <span className={`${styles.badge} ${isActive ? styles.badgeActive : styles.badgeInactive}`}>
    {label} <GoDotFill />
  </span>
);

export default StatusBadge;
