import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { voteInPoll } from '../controllers/poll.controller.js';

const router = Router();

router.use(authenticateToken);
router.post('/:questId/vote', voteInPoll);

export default router;
