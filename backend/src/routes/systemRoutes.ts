import { Router } from 'express';
import { adminSettings, createFirstAdmin, publicStatus, updateSettingsController } from '../controllers/systemController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.get('/status', publicStatus);
router.post('/setup', createFirstAdmin);
router.get('/settings', authenticate, authorize([Role.ADMIN]), adminSettings);
router.patch('/settings', authenticate, authorize([Role.ADMIN]), updateSettingsController);

export default router;
