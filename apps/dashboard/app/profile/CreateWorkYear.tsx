'use client';
import React, { useState, FormEvent, useEffect } from 'react';
import styles from './CreateWorkYear.module.css';
import generateYear from '../../../../packages/components/dashboard/generateYear/generateYear';
import { Schedules, WorkDaySettings } from '../../../../packages/types/calendar';
import { Router } from 'next/router';
import {
  createCalendar,
  getCalendarAdmin,
  getCalendarGuest,
} from '../../../../packages/services/calendar';
import { useClient } from '../../../../packages/contexts/ClientContext';
import { useUser } from '../../../../packages/contexts/UserContext';
import Calendar from '../../../../packages/components/dashboard/calender/Calendar';

interface CalendarData {
  year: number;
  months: {
    month: string;
    days: {
      date: string;
      available: boolean;
    }[];
  }[];
}

const defaultSchedules: Schedules = {
  monday: { start: '08:00', end: '16:00' },
  tuesday: { start: '08:00', end: '16:00' },
  wednesday: { start: '08:00', end: '16:00' },
  thursday: { start: '08:00', end: '16:00' },
  friday: { start: '08:00', end: '14:00' },
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
  const clientId = client?._id;

  const { user } = useUser();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [blockHolidays, setBlockHolidays] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedules>(defaultSchedules);
  const [workDaySettings, setWorkDaySettings] = useState<WorkDaySettings>(defaultWorkDaySettings);
  const [available, setAvailable] = useState<boolean>(true);
  const [message, setMessage] = useState('');
  const [calendar, setCalendar] = useState<{ [year: number]: CalendarData }>({});

  useEffect(() => {
    const fetchCurrentYear = async () => {
      if (clientId)
        try {
          const response = await getCalendarAdmin(currentYear, clientId);
          setCalendar({ [response.data.year]: response.data });
        } catch (error) {
          console.error('Error fetching calendar:', error);
        }
    };
    fetchCurrentYear();
  }, [currentYear, user?.role, clientId]);

  const handleScheduleChange = (day: keyof Schedules, field: 'start' | 'end', value: string) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleWorkDayChange = (day: keyof WorkDaySettings, value: boolean) => {
    setWorkDaySettings((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !clientId) return;

    const newYear = generateYear(
      clientId,
      year,
      schedules,
      blockHolidays,
      workDaySettings,
      available
    );
    // Send the 'calendar' object to your backend via fetch or axios
    try {
      const response = await createCalendar(newYear, clientId);
      setCalendar(response);
      setMessage(response.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  // Array to iterate through days of the week
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
              value={schedules[day].start}
              onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
              placeholder="Start"
            />
            <input
              type="time"
              value={schedules[day].end}
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
        <button type="submit">Create Work Days</button>
      </form>
      <Calendar calendars={calendar} />
    </>
  );
};

// Function to generate the calendar for the given year

// Example function to detect holidays (customize with your holiday data)

export default CreateWorkYear;
