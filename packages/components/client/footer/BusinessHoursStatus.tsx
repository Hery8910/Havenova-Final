'use client';

import { useEffect, useId, useState } from 'react';
import type { WeeklySchedule } from '../../../types/calendar';
import { LuChevronDown, LuClock3 } from 'react-icons/lu';
import styles from './BusinessHoursStatus.module.css';

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const satisfies ReadonlyArray<keyof WeeklySchedule>;

export interface FooterHoursStatusCopy {
  heading?: string;
  open?: string;
  closed?: string;
  opensAt?: string;
  closesAt?: string;
  opensTomorrowAt?: string;
  opensOn?: string;
  closedToday?: string;
  unavailable?: string;
  dayClosed?: string;
  ariaCurrentStatus?: string;
  ariaWeeklyHours?: string;
  expandHours?: string;
  collapseHours?: string;
}

function parseTimeToMinutes(value?: string): number | null {
  if (!value) return null;

  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function replaceTokens(template: string | undefined, values: Record<string, string>): string {
  if (!template) return '';

  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template
  );
}

function formatTime(locale: string, value: string): string {
  const totalMinutes = parseTimeToMinutes(value);

  if (totalMinutes === null) return value;

  const date = new Date(2024, 0, 1, Math.floor(totalMinutes / 60), totalMinutes % 60);

  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatDayLabel(locale: string, weekday: number): string {
  const baseSunday = new Date(Date.UTC(2024, 0, 7 + weekday));

  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'UTC',
  }).format(baseSunday);
}

function getNextOpening(
  schedule: WeeklySchedule,
  locale: string,
  now: Date,
  copy: FooterHoursStatusCopy
): string {
  for (let offset = 1; offset <= 7; offset += 1) {
    const weekday = (now.getDay() + offset) % 7;
    const daySchedule = schedule[DAY_KEYS[weekday]];

    if (!daySchedule) continue;

    const nextStart = parseTimeToMinutes(daySchedule.start);

    if (nextStart === null) continue;

    const formattedTime = formatTime(locale, daySchedule.start);

    if (offset === 1) {
      return replaceTokens(copy.opensTomorrowAt, { time: formattedTime });
    }

    return replaceTokens(copy.opensOn, {
      day: formatDayLabel(locale, weekday),
      time: formattedTime,
    });
  }

  return copy.unavailable ?? '';
}

function resolveStatus(schedule: WeeklySchedule, locale: string, now: Date, copy: FooterHoursStatusCopy) {
  const today = schedule[DAY_KEYS[now.getDay()]];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (today) {
    const startMinutes = parseTimeToMinutes(today.start);
    const endMinutes = parseTimeToMinutes(today.end);

    if (startMinutes !== null && endMinutes !== null && startMinutes < endMinutes) {
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return {
          isOpen: true,
          detail: replaceTokens(copy.closesAt, { time: formatTime(locale, today.end) }),
        };
      }

      if (currentMinutes < startMinutes) {
        return {
          isOpen: false,
          detail: replaceTokens(copy.opensAt, { time: formatTime(locale, today.start) }),
        };
      }
    }
  }

  const nextOpening = getNextOpening(schedule, locale, now, copy);

  return {
    isOpen: false,
    detail: nextOpening || copy.closedToday || '',
  };
}

export function BusinessHoursStatus({
  schedule,
  copy,
  locale,
}: {
  schedule: WeeklySchedule;
  copy?: FooterHoursStatusCopy;
  locale: string;
}) {
  const [now, setNow] = useState(() => new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const headingId = useId();
  const summaryId = useId();
  const panelId = useId();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const status = resolveStatus(schedule, locale, now, copy ?? {});
  const statusLabel = status.isOpen ? copy?.open ?? 'Open' : copy?.closed ?? 'Closed';
  const fullStatusLabel = [statusLabel, status.detail].filter(Boolean).join('. ');
  const toggleLabel = isExpanded
    ? copy?.collapseHours ?? 'Hide business hours'
    : copy?.expandHours ?? 'Show business hours';

  return (
    <section className={styles.hoursStatus} aria-labelledby={headingId}>
      <h3 className={styles.srOnly} id={headingId}>
        {copy?.heading}
      </h3>

      <button
        className={styles.summaryButton}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-describedby={summaryId}
        aria-label={toggleLabel}
        onClick={() => setIsExpanded((value) => !value)}
      >
        <span className={styles.leadingIcon} aria-hidden="true">
          <LuClock3 />
        </span>

        <span
          className={styles.summary}
          role="status"
          aria-live="polite"
          aria-label={
            copy?.ariaCurrentStatus ? `${copy.ariaCurrentStatus}: ${fullStatusLabel}` : fullStatusLabel
          }
          id={summaryId}
        >
          <span
            className={`${styles.badge} ${status.isOpen ? styles.badgeOpen : styles.badgeClosed}`}
          >
            {statusLabel}
          </span>
          <span className={styles.separator} aria-hidden="true">
            ·
          </span>
          <span className={styles.detail}>{status.detail}</span>
        </span>

        <span
          className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}
          aria-hidden="true"
        >
          <LuChevronDown />
        </span>
      </button>

      {isExpanded ? (
        <ol
          className={styles.weekList}
          aria-label={copy?.ariaWeeklyHours}
          aria-describedby={summaryId}
          id={panelId}
        >
          {DAY_KEYS.map((dayKey, index) => {
            const daySchedule = schedule[dayKey];
            const isToday = index === now.getDay();
            const timeRange = daySchedule
              ? `${formatTime(locale, daySchedule.start)} - ${formatTime(locale, daySchedule.end)}`
              : (copy?.dayClosed ?? 'Closed');

            return (
              <li key={dayKey} className={`${styles.weekItem} ${isToday ? styles.today : ''}`}>
                <span className={styles.dayLabel}>{formatDayLabel(locale, index)}</span>
                <span className={styles.timeLabel}>{timeRange}</span>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}
