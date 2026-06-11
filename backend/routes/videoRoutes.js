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

const router = express.Router();

router.use('/:videoId/comments', commentRoutes);

router.get('/trending', getTrendingVideos);
router.get('/', getVideos);
router.get('/:videoId', getVideoById);
router.post('/', protect, uploadLimiter, validateRequest(uploadVideoSchema), uploadVideo);
router.put('/:videoId', protect, updateVideo);
router.delete('/:videoId', protect, deleteVideo);
router.post('/:videoId/like', protect, likeVideo);
router.post('/:videoId/dislike', protect, dislikeVideo);

export default router;
