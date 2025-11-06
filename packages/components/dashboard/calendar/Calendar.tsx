'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './Calendar.module.css';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import {
  generateMonthDays,
  CalendarDay,
  BlockedSlot,
  generateDefaultSlots,
} from '@/packages/utils/calendar/calendarUtils';
import { getCalendarAvailability } from '@/packages/services/calendar';
import { CalendarDayPopup } from '../calendarDayPopup';
import { useClient } from '../../../contexts/client/ClientContext';

const Calendar: React.FC = () => {
  const { client } = useClient();
  const clientId = client?._id;
  const today = new Date();

  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [monthsCache, setMonthsCache] = useState<
    Record<string, { month: number; year: number; days: CalendarDay[] }>
  >({});

  // --- Generar o recuperar mes del cache ---
  const getOrGenerateMonth = useCallback(
    (
      year: number,
      month: number,
      blockedSlots: BlockedSlot[] = []
    ): { month: number; year: number; days: CalendarDay[] } => {
      const key = `${year}-${month}`;
      const cached = monthsCache[key];
      if (cached) return cached;

      const days = generateMonthDays(year, month, blockedSlots);
      const newMonth = { month, year, days };

      setMonthsCache((prev) => ({ ...prev, [key]: newMonth }));
      return newMonth;
    },
    [monthsCache]
  );

  // --- Obtener datos reales del backend ---
  useEffect(() => {
    if (!clientId) return;

    const fetchMonth = async () => {
      const key = `${currentYear}-${currentMonth}`;
      try {
        const res = await getCalendarAvailability({
          clientId,
          year: currentYear,
          month: currentMonth,
        });

        const backendMonth = res.months.find((m: any) => m.month === currentMonth);
        const blockedSlots = backendMonth?.blockedSlots || [];

        // Generar el mes con los bloqueos recibidos
        const days = generateMonthDays(currentYear, currentMonth, blockedSlots);
        const newMonth = { month: currentMonth, year: currentYear, days };

        setMonthsCache((prev) => ({ ...prev, [key]: newMonth }));
      } catch (err) {
        console.warn('No se pudo actualizar mes:', err);
      }
    };

    fetchMonth();
  }, [clientId, currentYear, currentMonth]);

  // --- Calcular mes actual (desde cache o generar vacío) ---
  const currentMonthData = useMemo(() => {
    const key = `${currentYear}-${currentMonth}`;
    return monthsCache[key] || getOrGenerateMonth(currentYear, currentMonth);
  }, [monthsCache, currentYear, currentMonth, getOrGenerateMonth]);

  // --- Construir celdas del calendario ---
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  let startDayIndex = firstDayOfMonth.getDay() || 7; // domingo → 0
  startDayIndex -= 1;

  const calendarCells: (CalendarDay | null)[] = [];

  // 1️⃣ Rellenar días vacíos al inicio (mes anterior)
  for (let i = 0; i < startDayIndex; i++) {
    calendarCells.push(null);
  }

  // 2️⃣ Días del mes actual
  calendarCells.push(...currentMonthData.days);

  // 3️⃣ Rellenar hasta completar 6 semanas (42 celdas)
  while (calendarCells.length < 42) {
    calendarCells.push(null);
  }

  // Agrupar en semanas
  const weeks: (CalendarDay | null)[][] = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    weeks.push(calendarCells.slice(i, i + 7));
  }

  // --- Navegación entre meses ---
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // --- Click en un día ---
  const handleDayClick = (day: CalendarDay) => {
    if (day.blocked) return;
    setSelectedDay(day);
  };

  return (
    <section className={styles.section}>
      <header className={`${styles.header} card`}>
        <button className={styles.button} onClick={handlePrevMonth}>
          <IoChevronBack />
        </button>
        <p>
          {new Date(currentYear, currentMonth - 1).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          })}
        </p>
        <button className={styles.button} onClick={handleNextMonth}>
          <IoChevronForward />
        </button>
      </header>

      <table className={`${styles.table} card`}>
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
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => (
                <td
                  key={di}
                  className={`${styles.cell} ${
                    !day ? styles.empty : day.blocked ? styles.blocked : styles.available
                  }`}
                  onClick={() => day && handleDayClick(day)}
                >
                  {day ? day.day : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDay && (
        <CalendarDayPopup
          date={selectedDay.date}
          slots={selectedDay.slots || generateDefaultSlots(selectedDay)}
          onClose={() => setSelectedDay(null)}
          onSelectSlot={(slot) => console.log('🕒 Slot seleccionado:', slot)}
        />
      )}
    </section>
  );
};

export default Calendar;
