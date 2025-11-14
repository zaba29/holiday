import { Request, Response } from 'express';
import {
  createInitialAdminAccount,
  getPublicSystemState,
  getSystemSettings,
  updateSystemSettings,
} from '../services/systemService';
import { AuthMode } from '@prisma/client';
import { authenticateUser } from '../services/authService';

export const publicStatus = async (_req: Request, res: Response) => {
  const state = await getPublicSystemState();
  res.json(state);
};

export const adminSettings = async (_req: Request, res: Response) => {
  const settings = await getSystemSettings();
  const state = await getPublicSystemState();
  res.json({
    settings,
    hasUsers: state.hasUsers,
  });
};

export const updateSettingsController = async (req: Request, res: Response) => {
  try {
    const payload: { allowSelfRegistration?: boolean; authMode?: AuthMode } = {};
    if (typeof req.body.allowSelfRegistration === 'boolean') {
      payload.allowSelfRegistration = req.body.allowSelfRegistration;
    }
    if (req.body.authMode) {
      payload.authMode = req.body.authMode;
    }
    const updated = await updateSystemSettings(payload);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createFirstAdmin = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, employeeNumber, password } = req.body;
    if (!firstName || !lastName || !email || !employeeNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await createInitialAdminAccount({ firstName, lastName, email, employeeNumber, password });
    const loginResult = await authenticateUser(email, password);
    return res.status(201).json(loginResult);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
