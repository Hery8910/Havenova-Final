'use client';

import type { CalendarSlot, SelectedCalendarSlot } from '../../../../../../types/calendar';
import { createLocalDateTime, formatLongDate } from './calendarHelpers';
import styles from './CalendarDaySlots.module.css';

export interface CalendarDaySlotsTexts {
  title: string;
  empty: string;
  noDateSelected: string;
  noAvailability: string;
  closeLabel: string;
  blockedBadge: string;
  selectedBadge: string;
  availableBadge: string;
}

interface CalendarDaySlotsProps {
  date: string | null;
  slots: CalendarSlot[];
  value: SelectedCalendarSlot | null;
  onSelect: (value: SelectedCalendarSlot | null) => void;
  onClose: () => void;
  texts?: Partial<CalendarDaySlotsTexts>;
}

const DEFAULT_TEXTS: CalendarDaySlotsTexts = {
  title: 'Available times',
  empty: 'Select a day to see available times.',
  noDateSelected: 'Select a date to continue.',
  noAvailability: 'There are no available times for this day.',
  closeLabel: 'Choose another day',
  blockedBadge: 'Blocked',
  selectedBadge: 'Selected',
  availableBadge: 'Available',
};

export default function CalendarDaySlots({
  date,
  slots,
  value,
  onSelect,
  onClose,
  texts,
}: CalendarDaySlotsProps) {
  const copy = { ...DEFAULT_TEXTS, ...texts };
  const headingId = date ? `calendar-day-slots-${date}` : 'calendar-day-slots';

  if (!date) {
    return null;
  }

  if (slots.length === 0) {
    return (
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="false"
        aria-labelledby={headingId}
        aria-live="polite"
      >
        <header className={styles.header}>
          <section className={styles.headerCopy}>
            <p className={styles.eyebrow}>{copy.title}</p>
            <h3 id={headingId} className={styles.title}>
              {formatLongDate(date)}
            </h3>
          </section>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            {copy.closeLabel}
          </button>
        </header>
        <p className={styles.empty}>{copy.noAvailability}</p>
      </aside>
    );
  }

  return (
    <aside
      className={styles.panel}
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      aria-live="polite"
    >
      <header className={styles.header}>
        <section className={styles.headerCopy}>
          <p className={styles.eyebrow}>{copy.title}</p>
          <h3 id={headingId} className={styles.title}>
            {formatLongDate(date)}
          </h3>
        </section>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          {copy.closeLabel}
        </button>
      </header>

      <ul className={styles.slotList}>
        {slots.map((slot) => {
          const isSelected =
            Boolean(
              value &&
                createLocalDateTime(slot.date, slot.start)?.getTime() === value.start.getTime() &&
                createLocalDateTime(slot.date, slot.end)?.getTime() === value.end.getTime()
            );

          return (
            <li key={`${slot.date}-${slot.start}-${slot.end}`} className={styles.slotItem}>
              <button
                type="button"
                className={`${styles.slotButton} ${slot.blocked ? styles.blocked : styles.available} ${
                  isSelected ? styles.selected : ''
                }`}
                onClick={() =>
                  !slot.blocked &&
                  onSelect(
                    isSelected
                      ? null
                      : (() => {
                          const start = createLocalDateTime(slot.date, slot.start);
                          const end = createLocalDateTime(slot.date, slot.end);

                          return start && end ? { start, end } : null;
                        })()
                  )
                }
                disabled={slot.blocked}
                aria-pressed={isSelected}
              >
                <span className={styles.slotTime}>
                  {slot.start} - {slot.end}
                </span>
                <span className={styles.slotBadge}>
                  {slot.blocked
                    ? copy.blockedBadge
                    : isSelected
                      ? copy.selectedBadge
                      : copy.availableBadge}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
