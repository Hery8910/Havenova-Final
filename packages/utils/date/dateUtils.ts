const hourMs = 1000 * 60 * 60;
const dayMs = hourMs * 24;
const weekMs = dayMs * 7;
const monthMs = dayMs * 30;

type RelativeTimeUnit = 'hour' | 'day' | 'week' | 'month';

type RelativeTimeForms = {
  one: string;
  other: string;
};

export type RelativeTimeTexts = Record<RelativeTimeUnit, RelativeTimeForms>;

export type FormatMessageAgeOptions = {
  locale?: string;
  relativeTime?: Partial<RelativeTimeTexts>;
};

const defaultRelativeTime: RelativeTimeTexts = {
  hour: { one: '{count} hr ago', other: '{count} hrs ago' },
  day: { one: '{count} day ago', other: '{count} days ago' },
  week: { one: '{count} week ago', other: '{count} weeks ago' },
  month: { one: '{count} month ago', other: '{count} months ago' },
};

const formatMonthDay = (date: Date, locale = 'en-US') => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
  }).formatToParts(date);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';

  return `${month.toLowerCase()} ${day}`;
};

const formatRelative = (
  unit: RelativeTimeUnit,
  count: number,
  relativeTime?: Partial<RelativeTimeTexts>
) => {
  const fallback = defaultRelativeTime[unit];
  const preferred = relativeTime?.[unit];
  const template = count === 1 ? preferred?.one || fallback.one : preferred?.other || fallback.other;
  return template.includes('{count}') ? template.replace('{count}', String(count)) : template;
};

export const formatMessageAge = (
  value: string | Date,
  options: FormatMessageAgeOptions = {},
  now: Date = new Date()
) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Math.max(0, now.getTime() - date.getTime());

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return formatRelative('hour', hours, options.relativeTime);
  }

  if (diffMs < weekMs) {
    const days = Math.floor(diffMs / dayMs);
    return formatRelative('day', days, options.relativeTime);
  }

  if (diffMs < monthMs) {
    const weeks = Math.floor(diffMs / weekMs);
    return formatRelative('week', weeks, options.relativeTime);
  }

  if (diffMs < monthMs * 2) {
    return formatRelative('month', 1, options.relativeTime);
  }

  return formatMonthDay(date, options.locale);
};
