import { Router } from 'express';
import {
  createQuest,
  getQuests,
  getQuestById,
  updateQuest,
  deleteQuest,
  updateQuestProgress,
  incrementPomodoro,
} from '../controllers/quest.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', getQuests);
router.post('/', createQuest);
router.get('/:id', getQuestById);
router.patch('/:id', updateQuest);
router.delete('/:id', deleteQuest);
router.patch('/:id/progress', updateQuestProgress);
router.post('/:id/pomodoro', incrementPomodoro);

export default router;
