import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';
import { employeeDashboard, adminDashboard } from '../controllers/dashboardController';

const router = Router();

router.get('/employee', authenticate, authorize([Role.EMPLOYEE, Role.ADMIN]), employeeDashboard);
router.get('/admin', authenticate, authorize([Role.ADMIN]), adminDashboard);

export default router;
