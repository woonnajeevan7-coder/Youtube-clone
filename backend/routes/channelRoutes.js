import express from 'express';
import { createChannel, getChannelById, subscribeChannel, checkSubscription } from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, createChannelSchema } from '../middleware/validationMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', protect, validateRequest(createChannelSchema), asyncHandler(createChannel));
router.get('/:channelId', asyncHandler(getChannelById));
router.post('/:channelId/subscribe', protect, asyncHandler(subscribeChannel));
router.get('/:channelId/isSubscribed', protect, asyncHandler(checkSubscription));

export default router;
