"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeaveRequests = exports.changeLeaveStatus = exports.createLeaveRequest = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const date_1 = require("../utils/date");
const client_1 = require("@prisma/client");
const mailer_1 = require("../email/mailer");
const env_1 = require("../config/env");
const createLeaveRequest = async (userId, data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if ((0, date_1.includesBankHoliday)(start, end)) {
        throw new Error('Range includes a bank holiday');
    }
    const daysRequested = (0, date_1.calculateWorkingDays)(start, end);
    const existingOverlap = await prisma_1.default.leaveRequest.findFirst({
        where: {
            userId,
            status: client_1.LeaveStatus.APPROVED,
            OR: [
                { startDate: { lte: end }, endDate: { gte: start } },
            ],
        },
    });
    if (existingOverlap) {
        throw new Error('Overlapping approved leave');
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error('User not found');
    if (data.type === client_1.LeaveType.HOLIDAY && user.remainingDays < daysRequested) {
        throw new Error('Insufficient balance');
    }
    const leave = await prisma_1.default.leaveRequest.create({
        data: {
            userId,
            startDate: start,
            endDate: end,
            daysRequested,
            type: data.type,
            employeeNote: data.comment,
        },
    });
    await (0, mailer_1.sendMail)({
        to: env_1.config.adminEmail,
        subject: 'New leave request pending',
        html: `Employee ${user.firstName} ${user.lastName} requested leave from ${data.startDate} to ${data.endDate}.`,
    });
    return leave;
};
exports.createLeaveRequest = createLeaveRequest;
const changeLeaveStatus = async (leaveId, status, adminNote) => {
    const leave = await prisma_1.default.leaveRequest.update({
        where: { id: leaveId },
        data: { status, adminNote },
        include: { user: true },
    });
    if (status === client_1.LeaveStatus.APPROVED && leave.type === client_1.LeaveType.HOLIDAY) {
        await prisma_1.default.user.update({
            where: { id: leave.userId },
            data: {
                remainingDays: leave.user.remainingDays - leave.daysRequested,
                daysTaken: leave.user.daysTaken + leave.daysRequested,
            },
        });
    }
    if (status === client_1.LeaveStatus.REJECTED && adminNote) {
        // no balance change
    }
    await (0, mailer_1.sendMail)({
        to: leave.user.email,
        subject: `Leave request ${status.toLowerCase()}`,
        html: `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} is ${status}. ${adminNote || ''} Remaining days: ${leave.user.remainingDays}`,
    });
    return leave;
};
exports.changeLeaveStatus = changeLeaveStatus;
const listLeaveRequests = (params) => prisma_1.default.leaveRequest.findMany({
    where: {
        status: params.status,
        userId: params.userId,
    },
    include: { user: true },
    orderBy: { startDate: 'desc' },
});
exports.listLeaveRequests = listLeaveRequests;
