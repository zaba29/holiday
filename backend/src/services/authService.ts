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

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '12h' }
  );

  return { user, token };
};

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const createInitialAdmin = async () => {
  const email = 'admin@company.test';
  const plainPassword = 'admin';

  const passwordHash = await hashPassword(plainPassword);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      annualAllocation: config.defaultAnnualAllocation,
      remainingDays: config.defaultAnnualAllocation,
    },
    create: {
      firstName: 'Initial',
      lastName: 'Admin',
      email,
      employeeNumber: 'ADMIN-001',
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      annualAllocation: config.defaultAnnualAllocation,
      remainingDays: config.defaultAnnualAllocation,
    },
  });

  console.log('Default admin ensured: admin@company.test / admin');

  return admin;
};
