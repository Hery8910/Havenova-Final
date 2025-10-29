// packages/utils/validators/dashboardValidators/holidays.ts

export type CityKey = 'berlin' | 'hamburg' | 'munich';

interface CityHolidays {
  [year: number]: string[];
}

interface HolidaysByCity {
  [city: string]: CityHolidays;
}

export const holidaysByCity: HolidaysByCity = {
  berlin: {
    2026: [
      '2026-01-01', // New Year's Day
      '2026-03-08', // International Women's Day
      '2026-04-18', // Good Friday
      '2026-04-21', // Easter Monday
      '2026-05-01', // Labour Day
      '2026-05-29', // Ascension Day
      '2026-06-09', // Whit Monday
      '2026-10-03', // German Unity Day
      '2026-12-25', // Christmas Day
      '2026-12-26', // Boxing Day
    ],
  },
  // Ejemplo: Hamburg o Munich pueden agregarse fácilmente después
  // hamburg: { 2025: [ ... ] },
  // munich: { 2025: [ ... ] },
};

/** Devuelve true si la fecha es feriado en la ciudad especificada */
export const isHoliday = (dateObj: Date, city: CityKey = 'berlin'): boolean => {
  const formattedDate = dateObj.toISOString().split('T')[0];
  const year = dateObj.getFullYear();
  const holidays = holidaysByCity[city]?.[year] ?? [];
  return holidays.includes(formattedDate);
};

/** Devuelve todos los feriados de la ciudad para un año (para enviar al backend) */
export const getCityHolidays = (
  year: number,
  city: CityKey = 'berlin'
): { date: string; reason: 'holiday' }[] => {
  const holidays = holidaysByCity[city]?.[year] ?? [];
  return holidays.map((date) => ({ date, reason: 'holiday' as const }));
};
