import React, { useState } from 'react';
import styles from './Calendar.module.css';

interface Day {
  date: string; // Formato: YYYY-MM-DD
  available: boolean;
}

interface MonthData {
  month: string;
  days: Day[];
}

interface CalendarData {
  year: number;
  months: MonthData[];
}

interface CalendarProps {
  calendars: { [year: number]: CalendarData };
  onToggleDay?: (day: Day) => void;
}

const Calendar: React.FC<CalendarProps> = ({ calendars, onToggleDay }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());

  const currentCalendar = calendars[currentYear];

  if (!currentCalendar) {
    return <div>Loading calendar for {currentYear}...</div>;
  }

  const currentMonthData = currentCalendar.months[currentMonth];
  let previousMonthData: MonthData | null = null;
  let nextMonthData: MonthData | null = null;

  if (currentMonth > 0) {
    previousMonthData = currentCalendar.months[currentMonth - 1];
  } else {
    const prevYearCalendar = calendars[currentYear - 1];
    if (prevYearCalendar) {
      previousMonthData = prevYearCalendar.months[11];
    }
  }

  if (currentMonth < currentCalendar.months.length - 1) {
    nextMonthData = currentCalendar.months[currentMonth + 1];
  } else {
    const nextYearCalendar = calendars[currentYear + 1];
    if (nextYearCalendar) {
      nextMonthData = nextYearCalendar.months[0];
    }
  }

  if (!currentMonthData) {
    return <div>No data for this month.</div>;
  }

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  let startDayIndex = firstDayOfMonth.getDay();
  if (startDayIndex === 0) startDayIndex = 7;
  startDayIndex = startDayIndex - 1;

  const calendarCells: (Day | null)[] = [];

  // Cambios aquí:
  for (let i = startDayIndex; i > 0; i--) {
    if (previousMonthData) {
      let prevDayIndex = previousMonthData.days.length - i;
      const prevDay = previousMonthData.days[prevDayIndex];
      calendarCells.push(prevDay ? { ...prevDay, available: false } : null);
    } else {
      calendarCells.push(null);
    }
  }

  currentMonthData.days.forEach((day) => {
    calendarCells.push(day);
  });
  const rest = 42 - calendarCells.length;

  while (calendarCells.length < 42) {
    if (nextMonthData) {
      let nextDay = calendarCells.length + rest - 42;
      const futureDay = nextMonthData.days[nextDay];
      calendarCells.push(futureDay ? { ...futureDay, available: false } : null);
    } else {
      calendarCells.push(null);
    }
  }

  const weeks = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  const toggleDayBlock = (day: Day) => {
    if (onToggleDay) {
      onToggleDay(day);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          Previous
        </button>
        <h2>
          {new Date(currentYear, currentMonth).toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          Next
        </button>
      </div>
      <table style={{ width: '500px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  style={{
                    width: '60px',
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: day ? (day.available ? '#fff' : '#fdd') : '#eee',
                    textAlign: 'center',
                    cursor: day ? 'pointer' : 'default',
                  }}
                  onClick={() => day && toggleDayBlock(day)}
                >
                  {day ? day.date.slice(8) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
