import React from 'react';
interface Day {
    date: string;
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
    calendars: {
        [year: number]: CalendarData;
    };
    onToggleDay?: (day: Day) => void;
}
declare const Calendar: React.FC<CalendarProps>;
export default Calendar;
//# sourceMappingURL=Calendar.d.ts.map