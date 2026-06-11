import express from 'express';
import { createChannel, getChannelById, subscribeChannel, checkSubscription } from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, createChannelSchema } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/', protect, validateRequest(createChannelSchema), createChannel);
router.get('/:channelId', getChannelById);
router.post('/:channelId/subscribe', protect, subscribeChannel);
router.get('/:channelId/isSubscribed', protect, checkSubscription);

export default router;
