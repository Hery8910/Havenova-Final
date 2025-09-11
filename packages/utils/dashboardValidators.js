const isHoliday = (dateObj) => {
    const formattedDate = dateObj.toISOString().split("T")[0];
    const berlinHolidays2025 = [
        "2025-01-01", // New Year's Day
        "2025-03-08", // International Women's Day
        "2025-04-18", // Good Friday
        "2025-04-21", // Easter Monday
        "2025-05-01", // Labour Day
        "2025-05-29", // Ascension Day
        "2025-06-09", // Whit Monday
        "2025-10-03", // German Unity Day
        "2025-12-25", // Christmas Day
        "2025-12-26", // Boxing Day
    ];
    return berlinHolidays2025.includes(formattedDate);
};
export default isHoliday;
