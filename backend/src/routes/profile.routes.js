import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getProfile, updatePreferences } from '../controllers/profile.controller.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getProfile);
router.patch('/preferences', updatePreferences);

export default router;
