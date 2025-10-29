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

export interface Month {
  month: number; // 1..12
  days: Day[];
}

export interface Calendar {
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
  data?: Calendar;
  message?: string;
  error?: string;
}
