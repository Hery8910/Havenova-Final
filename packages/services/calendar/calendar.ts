// ----- CALENDAR -----

import api from '../api/api';

export interface DaySchedule {
  start: string;
  end: string;
}

export interface WeekSchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface BlockedDate {
  date: string;
  reason?: 'holiday' | 'vacation' | 'manual' | 'other';
}

export interface CreateCalendarPayload {
  clientId: string;
  year: number;
  baseWeekSchedule: WeekSchedule;
  blockedDates?: BlockedDate[];
  overwriteIfExists?: boolean;
}

/**
 * Envía la configuración del año al backend para generar el calendario completo.
 * Usa cookies para el token automáticamente (gracias a withCredentials: true).
 */
export const createCalendar = async (payload: CreateCalendarPayload): Promise<any> => {
  try {
    const { data } = await api.post('/api/calendar', payload);
    return data;
  } catch (error: any) {
    console.error('❌ Error creating calendar:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Error creating calendar' };
  }
};

// Actualiza parcialmente un calendario existente para un año
export const updateCalendar = async (
  year: number,
  updateData: any,
  clientId: string | undefined
): Promise<any> => {
  try {
    const response = await api.patch(`/api/calendar/update/${year}`, {
      ...updateData,
      clientId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Recupera la disponibilidad del calendario para un cliente y año dado.
 * Por defecto devuelve el mes actual y el siguiente.
 */
export const getCalendarAvailability = async ({
  clientId,
  year,
  month,
  role = 'INSPECTOR',
  serviceType = 'inspection',
}: {
  clientId: string | undefined;
  year: number;
  month?: number; // 1..12
  role?: string;
  serviceType?: string;
}): Promise<any> => {
  try {
    const response = await api.get(`/api/calendar/availability/${year}`, {
      params: {
        clientId,
        month,
        role,
        serviceType,
      },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Error fetching calendar availability:', error.response?.data || error);
    throw error.response?.data || { message: 'Error fetching calendar availability' };
  }
};
