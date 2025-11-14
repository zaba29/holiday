import prisma from '../prisma';
import { calculateWorkingDays, includesBankHoliday } from '../utils/date';
import { LeaveStatus, LeaveType } from '@prisma/client';
import { sendMail } from '../email/mailer';
import { config } from '../config/env';

export const createLeaveRequest = async (
  userId: number,
  data: { startDate: string; endDate: string; type: LeaveType; comment?: string }
) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  if (includesBankHoliday(start, end)) {
    throw new Error('Range includes a bank holiday');
  }
  const daysRequested = calculateWorkingDays(start, end);
  const existingOverlap = await prisma.leaveRequest.findFirst({
    where: {
      userId,
      status: LeaveStatus.APPROVED,
      OR: [
        { startDate: { lte: end }, endDate: { gte: start } },
      ],
    },
  });
  if (existingOverlap) {
    throw new Error('Overlapping approved leave');
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (data.type === LeaveType.HOLIDAY && user.remainingDays < daysRequested) {
    throw new Error('Insufficient balance');
  }
  const leave = await prisma.leaveRequest.create({
    data: {
      userId,
      startDate: start,
      endDate: end,
      daysRequested,
      type: data.type,
      employeeNote: data.comment,
    },
  });
  await sendMail({
    to: config.adminEmail,
    subject: 'New leave request pending',
    html: `Employee ${user.firstName} ${user.lastName} requested leave from ${data.startDate} to ${data.endDate}.`,
  });
  return leave;
};

export const changeLeaveStatus = async (
  leaveId: number,
  status: LeaveStatus,
  adminNote?: string
) => {
  const leave = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status, adminNote },
    include: { user: true },
  });
  if (status === LeaveStatus.APPROVED && leave.type === LeaveType.HOLIDAY) {
    await prisma.user.update({
      where: { id: leave.userId },
      data: {
        remainingDays: leave.user.remainingDays - leave.daysRequested,
        daysTaken: leave.user.daysTaken + leave.daysRequested,
      },
    });
  }
  if (status === LeaveStatus.REJECTED && adminNote) {
    // no balance change
  }
  await sendMail({
    to: leave.user.email,
    subject: `Leave request ${status.toLowerCase()}`,
    html: `Your leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} is ${status}. ${
      adminNote || ''
    } Remaining days: ${leave.user.remainingDays}`,
  });
  return leave;
};

export const listLeaveRequests = (params: {
  status?: LeaveStatus;
  userId?: number;
}) =>
  prisma.leaveRequest.findMany({
    where: {
      status: params.status,
      userId: params.userId,
    },
    include: { user: true },
    orderBy: { startDate: 'desc' },
  });
