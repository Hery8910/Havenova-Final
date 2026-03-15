export interface DaySchedule {
  start: string; // HH:mm
  end: string; // HH:mm
}

export interface WeeklySchedule {
  sunday: DaySchedule | null;
  monday: DaySchedule | null;
  tuesday: DaySchedule | null;
  wednesday: DaySchedule | null;
  thursday: DaySchedule | null;
  friday: DaySchedule | null;
  saturday: DaySchedule | null;
}

export interface ClientCalendarSettings {
  clientId: string;
  schedule: WeeklySchedule;
  slotDurationMinutes: number;
}

export type BlockReason =
  | 'holiday'
  | 'vacation'
  | 'overbooked'
  | 'manual'
  | 'company_closed'
  | 'other';

export interface BlockedSlot {
  date: string; // YYYY-MM-DD
  start?: string; // HH:mm
  end?: string; // HH:mm
  fullDay?: boolean;
  reason: BlockReason;
}

export interface MonthlyAvailabilityData {
  clientId: string;
  year: number;
  month: number; // 1..12
  blockedSlots: BlockedSlot[];
}

export interface MonthlyAvailabilityResponse {
  success: boolean;
  data?: MonthlyAvailabilityData;
  message?: string;
  error?: string;
}

export interface CalendarSlot {
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  blocked: boolean;
  reason?: BlockReason;
  isSelected: boolean;
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  weekday: number; // 0..6
  isWorkday: boolean;
  isCurrentMonth: boolean;
  blocked: boolean;
  reason?: BlockReason;
  schedule: DaySchedule | null;
  slots: CalendarSlot[];
}

export interface SelectedCalendarSlot {
  start: Date;
  end: Date;
}

export interface CalendarError {
  message: string;
}
