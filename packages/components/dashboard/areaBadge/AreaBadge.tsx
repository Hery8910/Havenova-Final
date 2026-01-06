'use client';

import type { AreaKey } from '@/packages/types';
import styles from './AreaBadge.module.css';

interface AreaBadgeProps {
  value: AreaKey | string;
  label?: string;
}

const AreaBadge = ({ value, label }: AreaBadgeProps) => (
  <span className={styles.badge}>{label ?? value}</span>
);

export default AreaBadge;
