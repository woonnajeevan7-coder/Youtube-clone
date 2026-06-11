import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { createNotification } from './notificationController.js';
import crypto from 'crypto';

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * @desc    Get all videos
 * @route   GET /api/videos
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVideos = async (req, res) => {
  const { search, category, cursor, limit = 20 } = req.query;
  const limitNum = parseInt(limit, 10) || 20;

  const query = { isDeleted: { $ne: true } };
  if (search) query.title = { $regex: escapeRegExp(search), $options: 'i' };
  if (category && category !== 'All') query.category = category;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  try {
    const videos = await Video.find(query)
      .sort({ _id: -1 })
      .limit(limitNum);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single video by videoId
 * @route   GET /api/videos/:videoId
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId, isDeleted: { $ne: true } });
    if (video) res.json(video);
    else res.status(404).json({ message: 'Video not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Upload video
 * @route   POST /api/videos
 * @access  Private (Uploader)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const uploadVideo = async (req, res) => {
  const { title, thumbnailUrl, videoUrl, description, category, channelId } = req.body;

  if (!title || !thumbnailUrl || !videoUrl || !description || !category || !channelId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const videoIdStr = `video_${crypto.randomUUID()}`;
    const video = await Video.create({
      title,
      thumbnailUrl,
      videoUrl,
      description,
      category,
      channelId,
      videoId: videoIdStr,
      uploader: req.user.userId,
    });

    // Update the channel's video array
    const channel = await Channel.findOne({ channelId });
    if (channel) {
      channel.videos.push(videoIdStr);
      await channel.save();
    }

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update video by videoId
 * @route   PUT /api/videos/:videoId
 * @access  Private (Owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateVideo = async (req, res) => {
  const { title, description, thumbnailUrl, videoUrl, category } = req.body;
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl !== undefined) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl !== undefined) video.videoUrl = videoUrl;
    if (category !== undefined) video.category = category;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete video by videoId
 * @route   DELETE /api/videos/:videoId
 * @access  Private (Owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    // Soft delete video
    video.isDeleted = true;
    await video.save();

    // Remove from channel's video array
    const channel = await Channel.findOne({ channelId: video.channelId });
    if (channel) {
      channel.videos = channel.videos.filter(id => id !== video.videoId);
      await channel.save();
    }

    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

let trendingCache = null;
let cacheExpiry = 0;

/**
 * @desc    Get top trending videos with 1 minute cache
 * @route   GET /api/videos/trending
 * @access  Public
 */
export const getTrendingVideos = async (req, res) => {
  const now = Date.now();
  if (trendingCache && now < cacheExpiry) {
    return res.json(trendingCache);
  }

  try {
    const videos = await Video.find({ isDeleted: { $ne: true } })
      .sort({ views: -1 })
      .limit(10);
    trendingCache = videos;
    cacheExpiry = now + 60 * 1000; // 60 seconds
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Like video by videoId
 * @route   POST /api/videos/:videoId/like
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userObjectId = req.user._id;

    // Remove from dislikes if present
    if (Array.isArray(video.dislikes)) {
      video.dislikes = video.dislikes.filter(id => !id.equals(userObjectId));
    } else {
      video.dislikes = [];
    }

    if (!Array.isArray(video.likes)) {
      video.likes = [];
    }

    const isLiked = video.likes.some(id => id.equals(userObjectId));
    if (isLiked) {
      video.likes = video.likes.filter(id => !id.equals(userObjectId));
    } else {
      video.likes.push(userObjectId);
      if (video.uploader !== req.user.userId) {
        await createNotification(video.uploader, `${req.user.username} liked your video: ${video.title}`);
      }
    }

    await video.save();
    res.json({
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Dislike video by videoId
 * @route   POST /api/videos/:videoId/dislike
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userObjectId = req.user._id;

    // Remove from likes if present
    if (Array.isArray(video.likes)) {
      video.likes = video.likes.filter(id => !id.equals(userObjectId));
    } else {
      video.likes = [];
    }

    if (!Array.isArray(video.dislikes)) {
      video.dislikes = [];
    }

    const isDisliked = video.dislikes.some(id => id.equals(userObjectId));
    if (isDisliked) {
      video.dislikes = video.dislikes.filter(id => !id.equals(userObjectId));
    } else {
      video.dislikes.push(userObjectId);
    }

    await video.save();
    res.json({
      likes: video.likes,
      dislikes: video.dislikes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
