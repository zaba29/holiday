import { Router } from 'express';
import {
  register,
  showRegistration,
  approve,
  reject,
  askInfo,
  respondInfo,
} from '../controllers/registrationController';
import { authenticate, authorize } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', register);
router.get('/:token', authenticate, authorize([Role.ADMIN]), showRegistration);
router.post('/:token/approve', authenticate, authorize([Role.ADMIN]), approve);
router.post('/:token/reject', authenticate, authorize([Role.ADMIN]), reject);
router.post('/:token/more-info', authenticate, authorize([Role.ADMIN]), askInfo);
router.post('/info-response/:token', respondInfo);

export default router;
