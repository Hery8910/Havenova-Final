'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMonthlyAvailability } from '../../../../../../hooks';
import type {
  CalendarDay,
  SelectedCalendarSlot,
  WeeklySchedule,
} from '../../../../../../types/calendar';
import CalendarDaySlots, { type CalendarDaySlotsTexts } from './CalendarDaySlots';
import {
  formatLongDate,
  formatLocalDateKey,
  formatMonthLabel,
  generateCalendarDays,
  getMonthNavigation,
  getTomorrowDateString,
  parseDateString,
} from './calendarHelpers';
import styles from './AvailabilityCalendar.module.css';

export interface AvailabilityCalendarProps {
  clientId: string;
  schedule: WeeklySchedule;
  slotDurationMinutes: number;
  value: SelectedCalendarSlot | null;
  onChange: (value: SelectedCalendarSlot | null) => void;
  texts?: Partial<
    Omit<CalendarDaySlotsTexts, 'title'> & {
      title: string;
      slotsTitle: string;
      description: string;
      previousMonth: string;
      nextMonth: string;
      loading: string;
      errorPrefix: string;
      nonWorkday: string;
      blockedDay: string;
      availableDay: string;
      closeSlotsLabel: string;
    }
  >;
}

const DEFAULT_TEXTS = {
  title: 'Choose your preferred visit',
  description: 'Select a date and then choose one available time slot.',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  loading: 'Loading availability...',
  errorPrefix: 'Availability error:',
  nonWorkday: 'Unavailable',
  blockedDay: 'Blocked',
  availableDay: 'Open',
  slotsTitle: 'Available times',
  empty: 'Select a day to see available times.',
  noDateSelected: 'Select a date to continue.',
  noAvailability: 'There are no available times for this day.',
  blockedBadge: 'Blocked',
  selectedBadge: 'Selected',
  availableBadge: 'Available',
  closeSlotsLabel: 'Choose another day',
};

function getInitialMonthState(value: SelectedCalendarSlot | null) {
  const sourceDate = value?.start ? formatLocalDateKey(value.start) : getTomorrowDateString();
  const parsed = parseDateString(sourceDate);

  if (!parsed) {
    const tomorrow = parseDateString(getTomorrowDateString());
    return {
      year: tomorrow?.year ?? 2026,
      month: tomorrow?.month ?? 1,
      selectedDate: null,
    };
  }

  return {
    year: parsed.year,
    month: parsed.month,
    selectedDate: value?.start ? formatLocalDateKey(value.start) : null,
  };
}

export default function AvailabilityCalendar({
  clientId,
  schedule,
  slotDurationMinutes,
  value,
  onChange,
  texts,
}: AvailabilityCalendarProps) {
  const copy = { ...DEFAULT_TEXTS, ...texts };
  const minSelectableDate = useMemo(() => getTomorrowDateString(), []);
  const initialState = useMemo(() => getInitialMonthState(value), [value]);
  const [visibleYear, setVisibleYear] = useState(initialState.year);
  const [visibleMonth, setVisibleMonth] = useState(initialState.month);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialState.selectedDate);
  const [isSlotsOpen, setIsSlotsOpen] = useState(Boolean(initialState.selectedDate));
  const { availability, loading, error } = useMonthlyAvailability(clientId, visibleYear, visibleMonth);

  useEffect(() => {
    if (!value?.start) {
      return;
    }
    const selectedDateKey = formatLocalDateKey(value.start);

    if (selectedDateKey < minSelectableDate) {
      setSelectedDate(null);
      setIsSlotsOpen(false);
      onChange(null);
      return;
    }

    const parsed = parseDateString(selectedDateKey);
    if (!parsed) return;

    setVisibleYear(parsed.year);
    setVisibleMonth(parsed.month);
    setSelectedDate(selectedDateKey);
    setIsSlotsOpen(true);
  }, [minSelectableDate, onChange, value]);

  const calendarDays = useMemo<CalendarDay[]>(
    () =>
      generateCalendarDays(
        visibleYear,
        visibleMonth,
        schedule,
        slotDurationMinutes,
        availability?.data?.blockedSlots ?? [],
        value,
        minSelectableDate
      ),
    [
      availability?.data?.blockedSlots,
      minSelectableDate,
      schedule,
      slotDurationMinutes,
      value,
      visibleMonth,
      visibleYear,
    ]
  );

  const selectedDay = useMemo(
    () => calendarDays.find((day) => day.date === selectedDate) ?? null,
    [calendarDays, selectedDate]
  );

  const changeVisibleMonth = (offset: number) => {
    const next = getMonthNavigation(visibleYear, visibleMonth, offset);
    setVisibleYear(next.year);
    setVisibleMonth(next.month);
    setSelectedDate(null);
    setIsSlotsOpen(false);
    onChange(null);
  };

  const handleDaySelect = (day: CalendarDay) => {
    if (!day.isCurrentMonth || day.date < minSelectableDate) return;

    setSelectedDate(day.date);
    setIsSlotsOpen(true);

    if (!value?.start || formatLocalDateKey(value.start) !== day.date) {
      onChange(null);
    }
  };

  const closeSlotsPanel = () => {
    setSelectedDate(null);
    setIsSlotsOpen(false);
    onChange(null);
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <section className={styles.copy}>
          <h3 className={styles.title}>{copy.title}</h3>
          <p className={styles.description}>{copy.description}</p>
        </section>
      </header>

      <section className={styles.calendarShell}>
        <section className={styles.calendarPanel} aria-label={copy.title}>
          <nav className={styles.calendarToolbar} aria-label="Calendar month navigation">
            <button type="button" className={styles.navButton} onClick={() => changeVisibleMonth(-1)}>
              {copy.previousMonth}
            </button>
            <h4 className={styles.monthHeading}>{formatMonthLabel(visibleYear, visibleMonth)}</h4>
            <button type="button" className={styles.navButton} onClick={() => changeVisibleMonth(1)}>
              {copy.nextMonth}
            </button>
          </nav>

          {loading && <p className={styles.notice}>{copy.loading}</p>}
          {error && (
            <p className={`${styles.notice} ${styles.error}`}>
              {copy.errorPrefix} {error}
            </p>
          )}

          <ol className={styles.weekdayRow} aria-hidden="true">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
              <li key={label} className={styles.weekdayLabel}>
                {label}
              </li>
            ))}
          </ol>

          <ol className={styles.grid} aria-label={formatMonthLabel(visibleYear, visibleMonth)}>
            {calendarDays.map((day) => {
              const availableSlots = day.slots.filter((slot) => !slot.blocked).length;
              const isSelectedDay = day.date === selectedDate;
              const isPastOrToday = day.date < minSelectableDate;
              const isDisabled = !day.isCurrentMonth || isPastOrToday;
              const isAvailable = day.isCurrentMonth && !isPastOrToday && !day.blocked && availableSlots > 0;
              const statusLabel = isPastOrToday
                ? copy.nonWorkday
                : !day.isWorkday
                  ? copy.nonWorkday
                  : day.blocked
                    ? copy.blockedDay
                    : `${availableSlots} ${copy.availableDay}`;

              return (
                <li key={day.date} className={styles.dayItem}>
                  <button
                    type="button"
                    className={`${styles.dayCell} ${!day.isCurrentMonth ? styles.outsideMonth : ''} ${
                      isSelectedDay ? styles.daySelected : ''
                    } ${day.blocked ? styles.dayBlocked : ''} ${
                      isAvailable ? styles.dayAvailable : ''
                    } ${isPastOrToday ? styles.dayUnavailable : ''}`}
                    onClick={() => handleDaySelect(day)}
                    disabled={isDisabled}
                    aria-pressed={isSelectedDay}
                    aria-label={`${formatLongDate(day.date)}. ${statusLabel}.`}
                  >
                    <time className={styles.dayNumber} dateTime={day.date}>
                      {day.date.slice(-2)}
                    </time>
                    <span className={styles.dayMeta}>{statusLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          {selectedDay && (
            <p className={styles.selectedDaySummary}>
              {formatLongDate(selectedDay.date)}
              {!selectedDay.isWorkday
                ? ` • ${copy.nonWorkday}`
                : selectedDay.blocked
                  ? ` • ${copy.blockedDay}`
                  : ''}
            </p>
          )}
        </section>

        {isSlotsOpen && selectedDay && (
          <CalendarDaySlots
            date={selectedDay.date}
            slots={selectedDay.slots}
            value={value}
            onSelect={onChange}
            onClose={closeSlotsPanel}
            texts={{
              title: copy.slotsTitle,
              empty: copy.empty,
              noDateSelected: copy.noDateSelected,
              noAvailability: copy.noAvailability,
              closeLabel: copy.closeSlotsLabel,
              blockedBadge: copy.blockedBadge,
              selectedBadge: copy.selectedBadge,
              availableBadge: copy.availableBadge,
            }}
          />
        )}
      </section>
    </section>
  );
}
