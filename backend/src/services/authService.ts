import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { config } from '../config/env';
import { UserStatus } from '@prisma/client';

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

