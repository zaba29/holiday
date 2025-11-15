import { Request, Response } from 'express';
import {
  approveRegistration,
  createRegistration,
  getRegistrationByToken,
  rejectRegistration,
  requestMoreInfo,
  respondMoreInfo,
} from '../services/registrationService';
import { isRegistrationEnabled } from '../services/systemService';

export const register = async (req: Request, res: Response) => {
  const allowed = await isRegistrationEnabled();
  if (!allowed) {
    return res.status(403).json({ message: 'Registration disabled' });
  }
  const request = await createRegistration(req.body);
  res.status(201).json({ id: request.id });
};

export const showRegistration = async (req: Request, res: Response) => {
  const token = req.params.token;
  const request = await getRegistrationByToken(token);
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
};

export const approve = async (req: Request, res: Response) => {
  const user = await approveRegistration(req.params.token, req.body.allocation);
  res.json(user);
};

export const reject = async (req: Request, res: Response) => {
  if (!req.body.reason) return res.status(400).json({ message: 'Reason required' });
  const request = await rejectRegistration(req.params.token, req.body.reason);
  res.json(request);
};

export const askInfo = async (req: Request, res: Response) => {
  if (!req.body.message) return res.status(400).json({ message: 'Message required' });
  const request = await requestMoreInfo(req.params.token, req.body.message);
  res.json(request);
};

export const respondInfo = async (req: Request, res: Response) => {
  if (!req.body.message) return res.status(400).json({ message: 'Message required' });
  await respondMoreInfo(req.params.token, req.body.message);
  res.json({ ok: true });
};
