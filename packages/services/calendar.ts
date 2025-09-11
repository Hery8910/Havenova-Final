import { Calendar } from '../types/calendar';
import api from './api';

// ----- CALENDAR -----

// Crea un nuevo calendario (año)
export const createCalendar = async (calendarData: any, clientId: string): Promise<any> => {
  try {
    const response = await api.post('/api/calendar', {
      ...calendarData,
      clientId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Actualiza parcialmente un calendario existente para un año
export const updateCalendar = async (
  year: number,
  updateData: any,
  clientId: string
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

// Obtiene el calendario de un año específico (guest)
export const getCalendarGuest = async (year: number, clientId: string): Promise<any> => {
  try {
    const response = await api.get(`/api/calendar/guest/${year}`, {
      params: { clientId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtiene el calendario de un año específico (admin)
export const getCalendarAdmin = async (year: number, clientId: string): Promise<any> => {
  try {
    const response = await api.get(`/api/calendar/admin/${year}`, {
      params: { clientId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
