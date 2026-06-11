import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { createNotification } from './notificationController.js';
import crypto from 'crypto';
import axios from 'axios';

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// URL validation helper: uses HEAD request to check size/mime-type without downloading
const validateUrlHeader = async (url, expectedMimePrefix, maxSizeBytes) => {
  try {
    const response = await axios.head(url, { timeout: 3000 });
    const contentType = response.headers['content-type'];
    const contentLength = parseInt(response.headers['content-length'], 10);

    if (contentType && !contentType.startsWith(expectedMimePrefix)) {
      return { isValid: false, reason: `Invalid content type: ${contentType}. Expected ${expectedMimePrefix}*` };
    }
    if (contentLength && contentLength > maxSizeBytes) {
      const maxMb = maxSizeBytes / (1024 * 1024);
      return { isValid: false, reason: `File is too large (${(contentLength / (1024 * 1024)).toFixed(1)}MB). Max allowed: ${maxMb}MB` };
    }
    return { isValid: true };
  } catch (err) {
    // Fallback: Check file extension from URL
    try {
      const urlPath = new URL(url).pathname;
      const ext = urlPath.split('.').pop().toLowerCase();
      if (expectedMimePrefix === 'image') {
        const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        if (!validExts.includes(ext)) {
          return { isValid: false, reason: `Could not verify URL. Image extension must be one of: ${validExts.join(', ')}` };
        }
      } else if (expectedMimePrefix === 'video') {
        const validExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
        if (!validExts.includes(ext)) {
          return { isValid: false, reason: `Could not verify URL. Video extension must be one of: ${validExts.join(', ')}` };
        }
      }
      return { isValid: true };
    } catch (parseErr) {
      return { isValid: false, reason: `Invalid URL format: ${url}` };
    }
  }
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

  const videos = await Video.find(query)
    .select('videoId title thumbnailUrl views uploadDate category uploader channelId')
    .sort({ _id: -1 })
    .limit(limitNum)
    .lean();

  res.json(videos);
};

/**
 * @desc    Get single video by videoId
 * @route   GET /api/videos/:videoId
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getVideoById = async (req, res) => {
  const video = await Video.findOne({ videoId: req.params.videoId, isDeleted: { $ne: true } }).lean();
  if (video) res.json(video);
  else res.status(404).json({ message: 'Video not found' });
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

  // Validate thumbnail: expected image, max 5MB
  const thumbValidation = await validateUrlHeader(thumbnailUrl, 'image', 5 * 1024 * 1024);
  if (!thumbValidation.isValid) {
    return res.status(400).json({ message: `Thumbnail URL validation failed: ${thumbValidation.reason}` });
  }

  // Validate video: expected video, max 50MB
  const videoValidation = await validateUrlHeader(videoUrl, 'video', 50 * 1024 * 1024);
  if (!videoValidation.isValid) {
    return res.status(400).json({ message: `Video URL validation failed: ${videoValidation.reason}` });
  }

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
  
  const video = await Video.findOne({ videoId: req.params.videoId });
  if (!video) return res.status(404).json({ message: 'Video not found' });
  if (video.uploader !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

  // Optional updates: validate if provided
  if (thumbnailUrl) {
    const thumbValidation = await validateUrlHeader(thumbnailUrl, 'image', 5 * 1024 * 1024);
    if (!thumbValidation.isValid) {
      return res.status(400).json({ message: `Thumbnail URL validation failed: ${thumbValidation.reason}` });
    }
    video.thumbnailUrl = thumbnailUrl;
  }

  if (videoUrl) {
    const videoValidation = await validateUrlHeader(videoUrl, 'video', 50 * 1024 * 1024);
    if (!videoValidation.isValid) {
      return res.status(400).json({ message: `Video URL validation failed: ${videoValidation.reason}` });
    }
    video.videoUrl = videoUrl;
  }

  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (category !== undefined) video.category = category;

  const updatedVideo = await video.save();
  res.json(updatedVideo);
};

/**
 * @desc    Delete video by videoId
 * @route   DELETE /api/videos/:videoId
 * @access  Private (Owner)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteVideo = async (req, res) => {
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

  const videos = await Video.find({ isDeleted: { $ne: true } })
    .select('videoId title thumbnailUrl views uploadDate category uploader channelId')
    .sort({ views: -1 })
    .limit(10)
    .lean();

  trendingCache = videos;
  cacheExpiry = now + 60 * 1000; // 60 seconds
  res.json(videos);
};

/**
 * @desc    Like video by videoId
 * @route   POST /api/videos/:videoId/like
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const likeVideo = async (req, res) => {
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
};

/**
 * @desc    Dislike video by videoId
 * @route   POST /api/videos/:videoId/dislike
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const dislikeVideo = async (req, res) => {
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
};
