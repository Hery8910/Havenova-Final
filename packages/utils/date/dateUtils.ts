const hourMs = 1000 * 60 * 60;
const dayMs = hourMs * 24;
const weekMs = dayMs * 7;
const monthMs = dayMs * 30;

const formatMonthDay = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  }).formatToParts(date);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';

  return `${month.toLowerCase()} ${day}`;
};

export const formatMessageAge = (value: string | Date, now: Date = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Math.max(0, now.getTime() - date.getTime());

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  }

  if (diffMs < weekMs) {
    const days = Math.floor(diffMs / dayMs);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  if (diffMs < monthMs) {
    const weeks = Math.floor(diffMs / weekMs);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }

  if (diffMs < monthMs * 2) {
    return '1 month ago';
  }

  return formatMonthDay(date);
};
