import express from 'express';
import { addComment, getComments, editComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { commentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, commentLimiter, addComment);
router.get('/', getComments);
router.put('/:commentId', protect, editComment);
router.delete('/:commentId', protect, deleteComment);

export default router;
