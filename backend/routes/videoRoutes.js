import express from 'express';
import { getVideos, getVideoById, uploadVideo, updateVideo, deleteVideo, likeVideo, dislikeVideo } from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

router.use('/:videoId/comments', commentRoutes);

router.get('/', getVideos);
router.get('/:videoId', getVideoById);
router.post('/', protect, uploadVideo);
router.put('/:videoId', protect, updateVideo);
router.delete('/:videoId', protect, deleteVideo);
router.post('/:videoId/like', protect, likeVideo);
router.post('/:videoId/dislike', protect, dislikeVideo);

export default router;
