import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { getNotifications, markNotificationRead } from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getNotifications);
router.patch('/:id/read', markNotificationRead);

export default router;
