import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

/**
 * Returns an array of Date objects for every day in the current month.
 */
export function getCurrentMonthDays(): Date[] {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  return eachDayOfInterval({ start, end });
}

/**
 * Formats a Date object into a string.
 *
 * @param date - The Date object to format.
 * @param dateFormat - The format string (default is 'yyyy-MM-dd').
 * @returns A formatted date string.
 */
export function formatDate(date: Date, dateFormat: string = 'yyyy-MM-dd'): string {
  return format(date, dateFormat);
}
