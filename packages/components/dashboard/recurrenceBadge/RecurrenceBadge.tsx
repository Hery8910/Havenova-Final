'use client';

import type { RecurrenceKey } from '@/packages/types';
import styles from './RecurrenceBadge.module.css';

export const RECURRENCE_COLORS = {
  WEEKLY: {
    text: '#2563EB',
    background: 'rgba(37, 99, 235, 0.15)',
  },
  BIWEEKLY: {
    text: '#1D4ED8',
    background: 'rgba(29, 78, 216, 0.15)',
  },
  MONTHLY: {
    text: '#059669',
    background: 'rgba(5, 150, 105, 0.15)',
  },
  QUARTERLY: {
    text: '#047857',
    background: 'rgba(4, 120, 87, 0.15)',
  },
  SEMIANNUAL: {
    text: '#7C3AED',
    background: 'rgba(124, 58, 237, 0.15)',
  },
  ANNUAL: {
    text: '#6D28D9',
    background: 'rgba(109, 40, 217, 0.15)',
  },
  SEASONAL_SPRING: {
    text: '#16A34A',
    background: 'rgba(22, 163, 74, 0.15)',
  },
  SEASONAL_SUMMER: {
    text: '#CA8A04',
    background: 'rgba(202, 138, 4, 0.15)',
  },
  SEASONAL_AUTUMN: {
    text: '#B45309',
    background: 'rgba(180, 83, 9, 0.15)',
  },
  SEASONAL_WINTER: {
    text: '#0F766E',
    background: 'rgba(15, 118, 110, 0.15)',
  },
  ON_DEMAND: {
    text: '#374151',
    background: 'rgba(55, 65, 81, 0.12)',
  },
} as const;

const normalizeRecurrenceKey = (value: RecurrenceKey | string): RecurrenceKey | null => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toUpperCase().replace(/[^A-Z]/g, '_');
  return Object.prototype.hasOwnProperty.call(RECURRENCE_COLORS, normalized)
    ? (normalized as RecurrenceKey)
    : null;
};

interface RecurrenceBadgeProps {
  value: RecurrenceKey | string;
  label?: string;
}

const RecurrenceBadge = ({ value, label }: RecurrenceBadgeProps) => {
  const key = normalizeRecurrenceKey(value);
  const colors = key ? RECURRENCE_COLORS[key as keyof typeof RECURRENCE_COLORS] : null;
  const badgeLabel = label ?? key ?? value;

  return (
    <span
      className={styles.badge}
      style={
        colors
          ? {
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.text,
            }
          : undefined
      }
    >
      {badgeLabel}
    </span>
  );
};

export default RecurrenceBadge;
