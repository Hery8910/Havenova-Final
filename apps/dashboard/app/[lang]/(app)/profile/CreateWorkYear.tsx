'use client';
import React, { useState, FormEvent, useEffect } from 'react';
import styles from './CreateWorkYear.module.css';
import { createCalendar, getCalendarAdmin } from '../../../../packages/services/calendar';
import { useClient } from '../../../../packages/contexts/client/ClientContext';
import { useAuth } from '../../../../packages/contexts/auth/authContext';
import { Calendar } from '@/packages/components/dashboard/calendar';
import { Schedules, WorkDaySettings } from '../../../../packages/types/calendar/calendarTypes';

import { getCityHolidays } from '@/packages/utils/validators/dashboardValidators/dashboardValidators';
import type { BlockedDate } from '@/packages/services/calendar';

const defaultSchedules: Schedules = {
  monday: { start: '08:00', end: '16:00' },
  tuesday: { start: '08:00', end: '16:00' },
  wednesday: { start: '08:00', end: '16:00' },
  thursday: { start: '08:00', end: '16:00' },
  friday: { start: '08:00', end: '16:00' },
  saturday: { start: '08:00', end: '14:00' },
  sunday: { start: '08:00', end: '14:00' },
};

const defaultWorkDaySettings: WorkDaySettings = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};

const CreateWorkYear: React.FC = () => {
  const { client } = useClient();
  const { auth } = useAuth();
  const clientId = client?._id;
  const today = new Date();

  const [year, setYear] = useState<number>(today.getFullYear());
  const [blockHolidays, setBlockHolidays] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedules>(defaultSchedules);
  const [workDaySettings, setWorkDaySettings] = useState<WorkDaySettings>(defaultWorkDaySettings);
  const [message, setMessage] = useState('');
  const [calendar, setCalendar] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScheduleChange = (day: keyof Schedules, field: 'start' | 'end', value: string) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleWorkDayChange = (day: keyof WorkDaySettings, value: boolean) => {
    setWorkDaySettings((prev) => ({ ...prev, [day]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth?.userId || !clientId) {
      setMessage('Missing user or client info');
      return;
    }

    setLoading(true);
    setMessage('');

    // Construimos el horario base (solo días activos)
    const baseWeekSchedule: any = {};
    Object.entries(workDaySettings).forEach(([day, active]) => {
      if (active && schedules[day as keyof Schedules]) {
        baseWeekSchedule[day] = schedules[day as keyof Schedules];
      }
    });

    // Calculamos días feriados si blockHolidays está activo
    const blockedDates: BlockedDate[] = blockHolidays
      ? getCityHolidays(year, 'berlin') // o más adelante, client.city
      : [];

    try {
      const response = await createCalendar({
        clientId,
        year,
        baseWeekSchedule,
        blockedDates,
        overwriteIfExists: false,
      });

      setCalendar(response.data);
      setMessage(`✅ Calendar for ${year} created successfully`);
    } catch (error: any) {
      setMessage(error.message || '❌ Error creating calendar');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  /** Mock temporal para calcular feriados locales */
  const getHolidaysForYear = (year: number): string[] => {
    const holidays: string[] = [];
    const check = (month: number, day: number) =>
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Feriados comunes en Alemania
    holidays.push(check(1, 1)); // Año Nuevo
    holidays.push(check(5, 1)); // Día del trabajo
    holidays.push(check(10, 3)); // Día de la unidad
    holidays.push(check(12, 25)); // Navidad
    holidays.push(check(12, 26)); // 2º día de Navidad
    return holidays;
  };

  const daysOfWeek: (keyof Schedules)[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3>Create Work Year</h3>
        <p>{message}</p>
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min={2025}
            max={2040}
          />
        </div>

        {daysOfWeek.map((day) => (
          <div key={day}>
            <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
            <input
              type="time"
              value={schedules[day]?.start || ''}
              onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
              placeholder="Start"
            />
            <input
              type="time"
              value={schedules[day]?.end || ''}
              onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
              placeholder="End"
            />
            <label>
              <input
                type="checkbox"
                checked={workDaySettings[day]}
                onChange={(e) => handleWorkDayChange(day, e.target.checked)}
              />
              Work Day
            </label>
          </div>
        ))}

        <div>
          <label>
            <input
              type="checkbox"
              checked={blockHolidays}
              onChange={(e) => setBlockHolidays(e.target.checked)}
            />
            Automatically Block Holidays
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Work Days'}
        </button>
      </form>

      {calendar && <Calendar calendars={calendar} />}
    </>
  );
};

export default CreateWorkYear;
