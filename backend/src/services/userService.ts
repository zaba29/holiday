import prisma from '../prisma';
import { Role, UserStatus } from '@prisma/client';

export const listUsers = () =>
  prisma.user.findMany({ orderBy: { lastName: 'asc' }, select: { id: true, firstName: true, lastName: true, email: true, employeeNumber: true, role: true, status: true, annualAllocation: true, remainingDays: true } });

export const updateUser = (id: number, data: Partial<{ firstName: string; lastName: string; email: string; employeeNumber: string; annualAllocation: number; remainingDays: number; status: UserStatus; role: Role }>) =>
  prisma.user.update({ where: { id }, data });

export const getUserWithLeave = (id: number) =>
  prisma.user.findUnique({ where: { id }, include: { leaveRequests: true } });
