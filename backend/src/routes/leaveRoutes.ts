import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { createLeave, listMine, adminList, adminUpdate } from '../controllers/leaveController';

const router = Router();

router.post('/', authenticate, authorize([Role.EMPLOYEE, Role.ADMIN]), createLeave);
router.get('/mine', authenticate, authorize([Role.EMPLOYEE, Role.ADMIN]), listMine);
router.get('/admin', authenticate, authorize([Role.ADMIN]), adminList);
router.post('/:id/status', authenticate, authorize([Role.ADMIN]), adminUpdate);

export default router;
