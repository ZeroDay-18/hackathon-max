import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import {
  createEmotionEntry,
  deleteEmotionEntry,
  getEmotionSummary,
  listEmotionEntries,
  updateEmotionEntry,
} from '../controllers/emotion-diary.controller.js';

const router = Router();
router.use(authenticateToken);
router.get('/', listEmotionEntries);
router.post('/', createEmotionEntry);
router.get('/summary', getEmotionSummary);
router.patch('/:id', updateEmotionEntry);
router.delete('/:id', deleteEmotionEntry);

export default router;
