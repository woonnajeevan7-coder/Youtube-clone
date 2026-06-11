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

const router = express.Router();

router.post('/', protect, createPlaylist);
router.get('/', protect, getUserPlaylists);
router.get('/:playlistId', getPlaylistById);
router.post('/:playlistId/add', protect, addVideoToPlaylist);
router.post('/:playlistId/remove', protect, removeVideoFromPlaylist);
router.delete('/:playlistId', protect, deletePlaylist);

export default router;
