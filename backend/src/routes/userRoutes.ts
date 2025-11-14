import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { listUsers, updateUser } from '../services/userService';

const router = Router();

router.get('/', authenticate, authorize([Role.ADMIN]), async (_req, res) => {
  const users = await listUsers();
  res.json(users);
});

router.patch('/:id', authenticate, authorize([Role.ADMIN]), async (req, res) => {
  const user = await updateUser(parseInt(req.params.id, 10), req.body);
  res.json(user);
});

export default router;
