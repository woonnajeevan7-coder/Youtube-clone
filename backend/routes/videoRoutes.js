import express from 'express';
import {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  reactToVideo,
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getVideos).post(protect, uploadVideo);
router.route('/:id').get(getVideoById).put(protect, updateVideo).delete(protect, deleteVideo);
router.route('/:id/react').put(protect, reactToVideo);

export default router;
