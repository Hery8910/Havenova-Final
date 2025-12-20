// src/types/calendar/calendarTypes.ts

export interface Schedule {
  start: string;
  end: string;
}

export type DayReason =
  | 'holiday'
  | 'vacation'
  | 'overbooked'
  | 'manual'
  | 'previous_month'
  | 'other';

export interface Day {
  date: string; // 'YYYY-MM-DD'
  weekday: number; // 0 (Sunday) - 6 (Saturday)
  isWorkday: boolean;
  blocked: boolean;
  reason?: DayReason;
  schedule: Schedule | null;
  requests: any[]; // TODO: define type later (serviceId, start, end, workers)
}

export interface BlockedSlot {
  date: string;
  start: string;
  end: string;
  reason: DayReason;
}

export interface Month {
  month: number; // 1..12
  days: Day[];
  blockedSlots?: BlockedSlot[];
}

export interface CalendarData {
  clientId: string;
  year: number;
  months: Month[];
}

export interface Schedules {
  sunday?: Schedule;
  monday?: Schedule;
  tuesday?: Schedule;
  wednesday?: Schedule;
  thursday?: Schedule;
  friday?: Schedule;
  saturday?: Schedule;
}

export interface WorkDaySettings {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface CalendarError {
  message: string;
}

export interface CalendarResponse {
  success: boolean;
  data?: CalendarData;
  message?: string;
  error?: string;
}
