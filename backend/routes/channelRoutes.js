import express from 'express';
import { createChannel, getChannelById } from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createChannel);
router.get('/:id', getChannelById);

export default router;
