"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateRange = exports.includesBankHoliday = exports.calculateWorkingDays = void 0;
const date_fns_1 = require("date-fns");
const bankHolidays_1 = require("../config/bankHolidays");
const calculateWorkingDays = (start, end) => {
    const base = (0, date_fns_1.differenceInBusinessDays)(end, start) + 1;
    const holidays = bankHolidays_1.ukBankHolidays.filter((holiday) => {
        const date = new Date(holiday.date);
        return (0, date_fns_1.isWithinInterval)(date, { start, end });
    });
    return Math.max(base - holidays.length, 0);
};
exports.calculateWorkingDays = calculateWorkingDays;
const includesBankHoliday = (start, end) => {
    return bankHolidays_1.ukBankHolidays.some((holiday) => {
        const date = new Date(holiday.date);
        return (0, date_fns_1.isWithinInterval)(date, { start, end });
    });
};
exports.includesBankHoliday = includesBankHoliday;
const dateRange = (start, end) => (0, date_fns_1.eachDayOfInterval)({ start, end }).map((d) => d.toISOString().split('T')[0]);
exports.dateRange = dateRange;
