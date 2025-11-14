import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config/env';
import { Role, UserStatus } from '@prisma/client';

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid || user.status !== UserStatus.ACTIVE) {
    return null;
  }
  const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '12h' });
  return { user, token };
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const createInitialAdmin = async () => {
  const existing = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  if (existing) return existing;
  const passwordHash = await hashPassword('admin');
  const admin = await prisma.user.create({
    data: {
      firstName: 'Initial',
      lastName: 'Admin',
      email: 'admin@company.test',
      employeeNumber: 'ADMIN-001',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      annualAllocation: config.defaultAnnualAllocation,
      remainingDays: config.defaultAnnualAllocation,
    },
  });
  return admin;
};
