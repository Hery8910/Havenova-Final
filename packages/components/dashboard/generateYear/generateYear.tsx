// src/utils/calendar/generateYear.ts
import { isHoliday } from '@/packages/utils/validators/dashboardValidators/dashboardValidators';
import {
  Schedules,
  WorkDaySettings,
  Calendar,
  Day,
  Month,
  Schedule,
} from '../../../types/calendar/calendarTypes';

export const generateYear = (
  clientId: string,
  year: number,
  schedules: Schedules,
  blockHolidays: boolean,
  workDaySettings: WorkDaySettings
): Calendar => {
  const months: Month[] = [];

  const dayKeys: { [key: number]: keyof Schedules } = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  const getLocalFormattedDate = (dateObj: Date): string => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  for (let month = 0; month < 12; month++) {
    const days: Day[] = [];
    const numDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numDays; day++) {
      const dateObj = new Date(year, month, day);
      const weekday = dateObj.getDay(); // 0: Sunday ... 6: Saturday
      const key = dayKeys[weekday];
      const isWorkday = workDaySettings[key];
      const daySchedule = isWorkday ? schedules[key] ?? null : null;

      const formattedDate = getLocalFormattedDate(dateObj);
      const holiday = isHoliday(dateObj);
      const blocked = blockHolidays && holiday;

      days.push({
        date: formattedDate,
        weekday,
        isWorkday,
        blocked,
        reason: blocked ? 'holiday' : undefined,
        schedule: daySchedule,
        requests: [],
      });
    }

    months.push({ month: month + 1, days });
  }

  return { clientId, year, months };
};
