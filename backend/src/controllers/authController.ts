import { Request, Response } from 'express';
import { authenticateUser } from '../services/authService';
import prisma from '../prisma';
import { getPublicSystemState } from '../services/systemService';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const state = await getPublicSystemState();
  if (!state.hasUsers) {
    return res.status(400).json({ message: 'Initial setup required' });
  }
  const result = await authenticateUser(email, password);
  if (!result) {
    return res.status(401).json({ message: 'Invalid credentials or inactive account' });
  }
  return res.json({ token: result.token, user: { id: result.user.id, role: result.user.role, firstName: result.user.firstName, lastName: result.user.lastName } });
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { leaveRequests: true } });
  return res.json(user);
};
