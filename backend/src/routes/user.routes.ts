import { Router } from 'express';
import { getMe } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.get('/me', getMe);

export default router;
