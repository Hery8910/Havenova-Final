import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
const Calendar = ({ calendars, onToggleDay }) => {
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const currentCalendar = calendars[currentYear];
    if (!currentCalendar) {
        return _jsxs("div", { children: ["Loading calendar for ", currentYear, "..."] });
    }
    const currentMonthData = currentCalendar.months[currentMonth];
    let previousMonthData = null;
    let nextMonthData = null;
    if (currentMonth > 0) {
        previousMonthData = currentCalendar.months[currentMonth - 1];
    }
    else {
        const prevYearCalendar = calendars[currentYear - 1];
        if (prevYearCalendar) {
            previousMonthData = prevYearCalendar.months[11];
        }
    }
    if (currentMonth < currentCalendar.months.length - 1) {
        nextMonthData = currentCalendar.months[currentMonth + 1];
    }
    else {
        const nextYearCalendar = calendars[currentYear + 1];
        if (nextYearCalendar) {
            nextMonthData = nextYearCalendar.months[0];
        }
    }
    if (!currentMonthData) {
        return _jsx("div", { children: "No data for this month." });
    }
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayIndex = firstDayOfMonth.getDay();
    if (startDayIndex === 0)
        startDayIndex = 7;
    startDayIndex = startDayIndex - 1;
    const calendarCells = [];
    // Cambios aquí:
    for (let i = startDayIndex; i > 0; i--) {
        if (previousMonthData) {
            let prevDayIndex = previousMonthData.days.length - i;
            const prevDay = previousMonthData.days[prevDayIndex];
            calendarCells.push(prevDay ? { ...prevDay, available: false } : null);
        }
        else {
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
        }
        else {
            calendarCells.push(null);
        }
    }
    const weeks = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
        weeks.push(calendarCells.slice(i, i + 7));
    }
    const toggleDayBlock = (day) => {
        if (onToggleDay) {
            onToggleDay(day);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("button", { onClick: () => {
                            if (currentMonth === 0) {
                                setCurrentMonth(11);
                                setCurrentYear(currentYear - 1);
                            }
                            else {
                                setCurrentMonth(currentMonth - 1);
                            }
                        }, children: "Previous" }), _jsx("h2", { children: new Date(currentYear, currentMonth).toLocaleString('default', {
                            month: 'long',
                            year: 'numeric',
                        }) }), _jsx("button", { onClick: () => {
                            if (currentMonth === 11) {
                                setCurrentMonth(0);
                                setCurrentYear(currentYear + 1);
                            }
                            else {
                                setCurrentMonth(currentMonth + 1);
                            }
                        }, children: "Next" })] }), _jsxs("table", { style: { width: '500px', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Mon" }), _jsx("th", { children: "Tue" }), _jsx("th", { children: "Wed" }), _jsx("th", { children: "Thu" }), _jsx("th", { children: "Fri" }), _jsx("th", { children: "Sat" }), _jsx("th", { children: "Sun" })] }) }), _jsx("tbody", { children: weeks.map((week, weekIndex) => (_jsx("tr", { children: week.map((day, dayIndex) => (_jsx("td", { style: {
                                    width: '60px',
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    backgroundColor: day ? (day.available ? '#fff' : '#fdd') : '#eee',
                                    textAlign: 'center',
                                    cursor: day ? 'pointer' : 'default',
                                }, onClick: () => day && toggleDayBlock(day), children: day ? day.date.slice(8) : '' }, dayIndex))) }, weekIndex))) })] })] }));
};
export default Calendar;
