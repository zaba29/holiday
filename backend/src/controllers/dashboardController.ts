import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middleware/auth';
import { Role, LeaveStatus, UserStatus } from '@prisma/client';

export const employeeDashboard = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      leaveRequests: {
        where: { status: { in: [LeaveStatus.APPROVED, LeaveStatus.PENDING] } },
        orderBy: { startDate: 'asc' },
      },
    },
  });
  res.json({
    allocation: user?.annualAllocation,
    taken: user?.daysTaken,
    remaining: user?.remainingDays,
    upcoming: user?.leaveRequests?.filter((l) => l.status === LeaveStatus.APPROVED && l.startDate > new Date()).slice(0, 5),
    pending: user?.leaveRequests?.filter((l) => l.status === LeaveStatus.PENDING),
  });
};

export const adminDashboard = async (_req: Request, res: Response) => {
  const pendingRegistrations = await prisma.registrationRequest.count({ where: { status: 'PENDING' } });
  const pendingLeaves = await prisma.leaveRequest.count({ where: { status: LeaveStatus.PENDING } });
  const employees = await prisma.user.count({ where: { role: Role.EMPLOYEE, status: UserStatus.ACTIVE } });
  const upcoming = await prisma.leaveRequest.findMany({
    where: { status: LeaveStatus.APPROVED, startDate: { gte: new Date() } },
    include: { user: true },
    take: 5,
    orderBy: { startDate: 'asc' },
  });
  res.json({ pendingRegistrations, pendingLeaves, employees, upcoming });
};
