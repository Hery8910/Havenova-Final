import { get, set } from 'idb-keyval';
import type { CalendarDay } from './calendarUtils';

export interface CachedMonth {
  key: string; // Ej: "2025-10"
  month: number;
  year: number;
  days: CalendarDay[];
  updatedAt: string;
}

/**
 * Guarda un mes completo del calendario en IndexedDB
 */
export async function saveMonthToCache(month: CachedMonth) {
  await set(`calendar-${month.key}`, month);
}

/**
 * Recupera un mes del cache offline
 */
export async function loadMonthFromCache(year: number, month: number) {
  return await get(`calendar-${year}-${month}`);
}

/**
 * Limpia meses antiguos (opcional)
 */
export async function clearOldCache(beforeDate: Date) {
  // Podrías iterar sobre las keys para limpiar versiones antiguas
}
