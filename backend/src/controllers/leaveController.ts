import { Request, Response } from 'express';
import { createLeaveRequest, listLeaveRequests, changeLeaveStatus } from '../services/leaveService';
import { AuthRequest } from '../middleware/auth';
import { LeaveStatus } from '@prisma/client';

export const createLeave = async (req: AuthRequest, res: Response) => {
  const leave = await createLeaveRequest(req.user!.id, req.body);
  res.status(201).json(leave);
};

export const listMine = async (req: AuthRequest, res: Response) => {
  const leaves = await listLeaveRequests({ userId: req.user!.id });
  res.json(leaves);
};

export const adminList = async (req: Request, res: Response) => {
  const { status, userId } = req.query;
  const leaves = await listLeaveRequests({
    status: status ? (status as LeaveStatus) : undefined,
    userId: userId ? parseInt(userId as string, 10) : undefined,
  });
  res.json(leaves);
};

export const adminUpdate = async (req: Request, res: Response) => {
  const leave = await changeLeaveStatus(parseInt(req.params.id, 10), req.body.status, req.body.note);
  res.json(leave);
};
