import express from 'express';
import { addComment, getComments, editComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { commentLimiter } from '../middleware/rateLimiter.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router({ mergeParams: true });

router.post('/', protect, commentLimiter, asyncHandler(addComment));
router.get('/', asyncHandler(getComments));
router.put('/:commentId', protect, asyncHandler(editComment));
router.delete('/:commentId', protect, asyncHandler(deleteComment));

export default router;
