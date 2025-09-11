import isHoliday from '../../../utils/dashboardValidators';
import { Schedules, WorkDaySettings, Calendar, Day, Month } from '../../../types/calendar';

const generateYear = (
  clientId: string,
  year: number,
  schedules: Schedules,
  blockHolidays: boolean,
  workDaySettings: WorkDaySettings,
  available: boolean
): Calendar => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const months: Month[] = [];

  function getLocalFormattedDate(dateObj: Date): string {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Sumar 1 y agregar ceros a la izquierda
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  for (let month = 0; month < 12; month++) {
    const days: Day[] = [];
    const numDays = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= numDays; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

      const dayKeys: { [key: number]: keyof Schedules } = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
      };

      const dayKey = dayKeys[dayOfWeek];
      const isWorkDay = workDaySettings[dayKey];
      const daySchedule = isWorkDay ? schedules[dayKey] : null;

      const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
      const formattedDay = formatter.format(dateObj);
      const formattedDate = getLocalFormattedDate(dateObj);
      const isHolidayFlag = isHoliday(dateObj);

      days.push({
        dayName: formattedDay,
        date: formattedDate,
        schedule: daySchedule,
        workDay: isWorkDay,
        available: available,
        blocked: blockHolidays && isHolidayFlag,
        holiday: isHolidayFlag,
        requests: [],
      });
    }

    months.push({
      month: monthNames[month],
      days: days,
    });
  }

  return { clientId, year, months };
};

export default generateYear;
