import express from 'express';
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist
} from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

router.post('/', protect, asyncHandler(createPlaylist));
router.get('/', protect, asyncHandler(getUserPlaylists));
router.get('/:playlistId', asyncHandler(getPlaylistById));
router.post('/:playlistId/add', protect, asyncHandler(addVideoToPlaylist));
router.post('/:playlistId/remove', protect, asyncHandler(removeVideoFromPlaylist));
router.delete('/:playlistId', protect, asyncHandler(deletePlaylist));

export default router;
