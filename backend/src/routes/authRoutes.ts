import { Router } from 'express';
import { login, me } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, login);
router.get('/me', authenticate, me);

export default router;
