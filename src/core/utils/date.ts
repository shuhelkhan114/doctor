import { AvailabilityTime } from '@typings/common';
import format from 'date-fns/format';

export const getHoursAndMinutes = (date: Date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const window = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? 0 + minutes : minutes;

  return {
    hours,
    minutes,
    window: window as 'am' | 'pm',
  };
};

export const getDateFromHoursAndMinutes = (
  hours: number,
  minutes: number,
  window?: 'am' | 'pm'
) => {
  const date = new Date();
  let hrs = hours;
  if (window === 'pm') {
    hrs += 12;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hrs, minutes, 0);
};

export const getDateFromTimeZone = (utc: string) => {
  const formatter = new Intl.DateTimeFormat([], {
    timeZone: utc,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return new Date(formatter.format(new Date()));
};

export const getAvailabilityText = (
  available: boolean,
  startTime: AvailabilityTime,
  endTime: AvailabilityTime
) => {
  return available
    ? `${format(
        getDateFromHoursAndMinutes(startTime.hours, startTime.minutes, startTime.window),
        'h:mmaaa'
      )} - ${format(
        getDateFromHoursAndMinutes(endTime.hours, endTime.minutes, endTime.window),
        'h:mmaaa'
      )}`
    : 'Unavailable';
};

export type IntervalMapping = {
  label: string;
  seconds: number;
};

export const getTimeAgo = (date: Date, intervalMapping?: IntervalMapping[]) => {
  const intervals = intervalMapping || [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'min', seconds: 60 },
    { label: 'sec', seconds: 1 },
  ];
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds <= seconds);
  const count = Math.floor(seconds / (interval?.seconds || 1));
  if (!interval) {
    return 'now';
  }
  return `${count} ${interval?.label}${count !== 1 ? 's' : ''} ago`;
};
