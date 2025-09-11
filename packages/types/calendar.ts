export interface Schedule {
  start: string;
  end: string;
}

export interface Day {
  date: string;
  dayName: string;
  schedule: Schedule | null;
  workDay: boolean;
  available: boolean;
  blocked: boolean;
  holiday: boolean;
  requests: any[];
}

export interface Month {
  month: string;
  days: Day[];
}

export interface Calendar {
  clientId: string;
  year: number;
  months: Month[];
}

export interface Schedules {
  monday: Schedule;
  tuesday: Schedule;
  wednesday: Schedule;
  thursday: Schedule;
  friday: Schedule;
  saturday: Schedule;
  sunday: Schedule;
}

export interface WorkDaySettings {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface CalendarError {
  message: string;
}
export interface CalendarResponse {
  message: string;
  field: string;
  error: string;
}