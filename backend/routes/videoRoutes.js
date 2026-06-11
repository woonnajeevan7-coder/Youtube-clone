import express from 'express';
import { 
  getVideos, 
  getVideoById, 
  uploadVideo, 
  updateVideo, 
  deleteVideo, 
  likeVideo, 
  dislikeVideo, 
  getTrendingVideos 
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, uploadVideoSchema } from '../middleware/validationMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import commentRoutes from './commentRoutes.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.use('/:videoId/comments', commentRoutes);

router.get('/trending', asyncHandler(getTrendingVideos));
router.get('/', asyncHandler(getVideos));
router.get('/:videoId', asyncHandler(getVideoById));
router.post('/', protect, uploadLimiter, validateRequest(uploadVideoSchema), asyncHandler(uploadVideo));
router.put('/:videoId', protect, asyncHandler(updateVideo));
router.delete('/:videoId', protect, asyncHandler(deleteVideo));
router.post('/:videoId/like', protect, asyncHandler(likeVideo));
router.post('/:videoId/dislike', protect, asyncHandler(dislikeVideo));

export default router;
