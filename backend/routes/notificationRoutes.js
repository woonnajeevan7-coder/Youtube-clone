import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.get('/', protect, asyncHandler(getNotifications));
router.put('/read-all', protect, asyncHandler(markAllAsRead));
router.put('/:notificationId/read', protect, asyncHandler(markAsRead));

export default router;
