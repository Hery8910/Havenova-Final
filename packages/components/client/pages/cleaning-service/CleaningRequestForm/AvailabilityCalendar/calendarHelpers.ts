import type {
  BlockedSlot,
  CalendarDay,
  CalendarSlot,
  DaySchedule,
  SelectedCalendarSlot,
  WeeklySchedule,
} from '../../../../../../types/calendar';

type ScheduleKey = keyof WeeklySchedule;

const WEEKDAY_KEYS: ScheduleKey[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatDateParts(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseDateString(date: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;

  return { year, month, day };
}

export function createUtcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function createLocalDateTime(date: string, time: string): Date | null {
  const parsedDate = parseDateString(date);
  const minutes = parseTimeToMinutes(time);

  if (!parsedDate || minutes === null) return null;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return new Date(
    parsedDate.year,
    parsedDate.month - 1,
    parsedDate.day,
    hours,
    remainingMinutes,
    0,
    0
  );
}

export function formatLocalDateKey(value: Date): string {
  return formatDateParts(value.getFullYear(), value.getMonth() + 1, value.getDate());
}

export function formatLocalTimeKey(value: Date): string {
  return `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`;
}

export function getTodayDateString(): string {
  return DATE_FORMATTER.format(new Date());
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  return DATE_FORMATTER.format(tomorrow);
}

export function getWeekdayKey(weekday: number): ScheduleKey {
  return WEEKDAY_KEYS[weekday] ?? 'sunday';
}

export function getScheduleForWeekday(
  schedule: WeeklySchedule,
  weekday: number
): DaySchedule | null {
  return schedule[getWeekdayKey(weekday)];
}

export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);

  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function isFullDayBlocked(blockedSlot: BlockedSlot): boolean {
  return Boolean(blockedSlot.fullDay || (!blockedSlot.start && !blockedSlot.end));
}

function getBlockedRange(blockedSlot: BlockedSlot): { start: number; end: number } | null {
  if (isFullDayBlocked(blockedSlot)) return null;
  if (!blockedSlot.start || !blockedSlot.end) return null;

  const start = parseTimeToMinutes(blockedSlot.start);
  const end = parseTimeToMinutes(blockedSlot.end);

  if (start === null || end === null || start >= end) return null;

  return { start, end };
}

function slotMatchesSelection(
  slot: Pick<CalendarSlot, 'date' | 'start' | 'end'>,
  selectedSlot: SelectedCalendarSlot | null
): boolean {
  if (!selectedSlot) return false;

  return (
    formatLocalDateKey(selectedSlot.start) === slot.date &&
    formatLocalTimeKey(selectedSlot.start) === slot.start &&
    formatLocalTimeKey(selectedSlot.end) === slot.end
  );
}

export function generateDaySlots(
  date: string,
  daySchedule: DaySchedule | null,
  slotDurationMinutes: number,
  blockedSlots: BlockedSlot[],
  selectedSlot: SelectedCalendarSlot | null
): CalendarSlot[] {
  if (!daySchedule || slotDurationMinutes <= 0) return [];

  const startMinutes = parseTimeToMinutes(daySchedule.start);
  const endMinutes = parseTimeToMinutes(daySchedule.end);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    return [];
  }

  const fullDayBlock = blockedSlots.find(isFullDayBlocked);
  const slots: CalendarSlot[] = [];

  for (
    let currentStart = startMinutes;
    currentStart + slotDurationMinutes <= endMinutes;
    currentStart += slotDurationMinutes
  ) {
    const currentEnd = currentStart + slotDurationMinutes;
    const start = formatMinutesToTime(currentStart);
    const end = formatMinutesToTime(currentEnd);

    const blockingRange = blockedSlots.find((blockedSlot) => {
      const range = getBlockedRange(blockedSlot);

      if (!range) return false;

      return currentStart < range.end && currentEnd > range.start;
    });

    const blocked = Boolean(fullDayBlock || blockingRange);
    const reason = fullDayBlock?.reason ?? blockingRange?.reason;

    slots.push({
      date,
      start,
      end,
      blocked,
      reason,
      isSelected: slotMatchesSelection({ date, start, end }, selectedSlot),
    });
  }

  return slots;
}

export function generateCalendarDays(
  year: number,
  month: number,
  schedule: WeeklySchedule,
  slotDurationMinutes: number,
  blockedSlots: BlockedSlot[],
  selectedSlot: SelectedCalendarSlot | null,
  availableFromDate?: string
): CalendarDay[] {
  const firstDay = createUtcDate(year, month, 1);
  const firstWeekday = (firstDay.getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const gridStart = createUtcDate(year, month, 1 - firstWeekday);

  return Array.from({ length: totalCells }, (_, index) => {
    const currentDate = new Date(gridStart);
    currentDate.setUTCDate(gridStart.getUTCDate() + index);

    const date = DATE_FORMATTER.format(currentDate);
    const weekday = currentDate.getUTCDay();
    const daySchedule = getScheduleForWeekday(schedule, weekday);
    const dayBlockedSlots = blockedSlots.filter((blockedSlot) => blockedSlot.date === date);
    const fullDayBlock = dayBlockedSlots.find(isFullDayBlocked);
    const slots = generateDaySlots(
      date,
      daySchedule,
      slotDurationMinutes,
      dayBlockedSlots,
      selectedSlot
    );
    const isBeforeAvailableRange = Boolean(availableFromDate && date < availableFromDate);
    const isCurrentMonth = currentDate.getUTCMonth() === month - 1;
    const isWorkday = Boolean(daySchedule);
    const allSlotsBlocked = slots.length > 0 && slots.every((slot) => slot.blocked);
    const normalizedSlots = isBeforeAvailableRange
      ? slots.map((slot) => ({
          ...slot,
          blocked: true,
          isSelected: false,
        }))
      : slots;

    return {
      date,
      weekday,
      isWorkday,
      isCurrentMonth,
      blocked: Boolean(isBeforeAvailableRange || fullDayBlock || allSlotsBlocked),
      reason: fullDayBlock?.reason,
      schedule: daySchedule,
      slots: normalizedSlots,
    };
  });
}

export function formatMonthLabel(year: number, month: number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(createUtcDate(year, month, 1));
}

export function formatLongDate(date: string, locale = 'en-US'): string {
  const parsed = parseDateString(date);

  if (!parsed) return date;

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(createUtcDate(parsed.year, parsed.month, parsed.day));
}

export function getMonthNavigation(
  year: number,
  month: number,
  offset: number
): { year: number; month: number } {
  const nextDate = new Date(Date.UTC(year, month - 1 + offset, 1));

  return {
    year: nextDate.getUTCFullYear(),
    month: nextDate.getUTCMonth() + 1,
  };
}
