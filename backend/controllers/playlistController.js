import Playlist from '../models/Playlist.js';
import Video from '../models/Video.js';
import crypto from 'crypto';

export const createPlaylist = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Playlist name is required' });

  try {
    const playlist = await Playlist.create({
      playlistId: `playlist_${crypto.randomUUID()}`,
      name,
      userId: req.user.userId,
      videos: []
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.userId });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ playlistId: req.params.playlistId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    // Populate video details
    const videos = await Video.find({ videoId: { $in: playlist.videos } });
    res.json({ playlist, videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ message: 'VideoId is required' });

  try {
    const playlist = await Playlist.findOne({ playlistId: req.params.playlistId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeVideoFromPlaylist = async (req, res) => {
  const { videoId } = req.body;
  try {
    const playlist = await Playlist.findOne({ playlistId: req.params.playlistId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    playlist.videos = playlist.videos.filter(id => id !== videoId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ playlistId: req.params.playlistId });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
