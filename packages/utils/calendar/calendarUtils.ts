import { BlockedSlot, DayReason } from './../../types/calendar/calendarTypes';

export interface Slot {
  start: string; // "08:00"
  end: string; // "13:30"
  available: boolean;
  reason?: string;
}

export interface CalendarDay {
  date: string; // "2025-10-05"
  day: number; // 1..31
  month: number; // 1..12
  year: number;
  blocked: boolean;
  reason?: DayReason;
  start?: string;
  end?: string;
  past?: boolean;
  isCurrentMonth?: boolean;
  slots?: Slot[];
}

/**
 * Genera todos los días de un mes específico con valores por defecto.
 * - Marca como bloqueados los días pasados (comparando con la fecha actual).
 * - Si hay `blockedSlots` del backend, los aplica sobre esos días.
 */
export function generateMonthDays(
  year: number,
  month: number,
  blockedSlots: BlockedSlot[] = []
): CalendarDay[] {
  const totalDays = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];

  const today = new Date();
  const todayDateStr = today.toISOString().slice(0, 10);

  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isPast = new Date(dateStr) <= new Date(todayDateStr);

    // Buscar si el día está bloqueado por el backend
    const blockedSlot = blockedSlots.find((slot) => slot.date.startsWith(dateStr));

    const dayData: CalendarDay = {
      date: dateStr,
      day: i,
      month,
      year,
      blocked: isPast || !!blockedSlot, // 🔥 bloqueado si es pasado o está en backend
      isCurrentMonth: true,
      past: isPast,
      reason: blockedSlot?.reason,
      start: blockedSlot?.start,
      end: blockedSlot?.end,
    };

    days.push(dayData);
  }

  return days;
}

export function generateDefaultSlots(day: CalendarDay): Slot[] {
  const slots: Slot[] = [];
  const startHour = 8;
  const endHour = 18;
  for (let h = startHour; h < endHour; h++) {
    const start = `${String(h).padStart(2, '0')}:00`;
    const end = `${String(h + 1).padStart(2, '0')}:00`;
    const available = !day.blocked;
    slots.push({ start, end, available });
  }
  return slots;
}
