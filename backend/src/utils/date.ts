import { differenceInBusinessDays, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ukBankHolidays } from '../config/bankHolidays';

export const calculateWorkingDays = (start: Date, end: Date) => {
  const base = differenceInBusinessDays(end, start) + 1;
  const holidays = ukBankHolidays.filter((holiday) => {
    const date = new Date(holiday.date);
    return isWithinInterval(date, { start, end });
  });
  return Math.max(base - holidays.length, 0);
};

export const includesBankHoliday = (start: Date, end: Date) => {
  return ukBankHolidays.some((holiday) => {
    const date = new Date(holiday.date);
    return isWithinInterval(date, { start, end });
  });
};

export const dateRange = (start: Date, end: Date) =>
  eachDayOfInterval({ start, end }).map((d) => d.toISOString().split('T')[0]);
