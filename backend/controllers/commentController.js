import Video from '../models/Video.js';
import User from '../models/User.js';
import { createNotification } from './notificationController.js';
import sanitizeHtml from 'sanitize-html';
import crypto from 'crypto';

/**
 * @desc    Add a comment to a video
 * @route   POST /api/videos/:videoId/comments
 * @access  Private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const video = await Video.findOne({ videoId: req.params.videoId });
  if (!video) return res.status(404).json({ message: 'Video not found' });

  // Sanitize HTML inputs to prevent XSS
  const sanitizedText = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  });

  const comment = {
    commentId: `comment_${crypto.randomUUID()}`,
    userId: req.user.userId,
    text: sanitizedText,
    timestamp: new Date(),
  };

  video.comments.push(comment);
  await video.save();

  // Trigger notification
  if (video.uploader !== req.user.userId) {
    await createNotification(video.uploader, `${req.user.username} commented on your video: "${sanitizedText.substring(0, 30)}${sanitizedText.length > 30 ? '...' : ''}"`);
  }

  res.status(201).json({
    commentId: comment.commentId,
    userId: comment.userId,
    username: req.user.username,
    avatar: req.user.avatar || `https://ui-avatars.com/api/?name=${req.user.username}`,
    text: comment.text,
    timestamp: comment.timestamp
  });
};

/**
 * @desc    Get all comments for a specific video
 * @route   GET /api/videos/:videoId/comments
 * @access  Public
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getComments = async (req, res) => {
  const video = await Video.findOne({ videoId: req.params.videoId }).select('comments').lean();
  if (!video) return res.status(404).json({ message: 'Video not found' });

  // Fetch user details for each comment author
  const userIds = video.comments.map(c => c.userId);
  const users = await User.find({ userId: { $in: userIds } }).select('userId username avatar').lean();

  const userMap = {};
  users.forEach(u => {
    userMap[u.userId] = { username: u.username, avatar: u.avatar };
  });

  const commentsWithUser = video.comments.map(c => {
    const u = userMap[c.userId];
    return {
      commentId: c.commentId,
      userId: c.userId,
      username: u ? u.username : c.userId,
      avatar: u ? u.avatar : `https://ui-avatars.com/api/?name=${c.userId}`,
      text: c.text,
      timestamp: c.timestamp
    };
  });

  // Sort comments newest first
  commentsWithUser.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(commentsWithUser);
};

// @desc    Edit a comment
// @route   PUT /api/videos/:videoId/comments/:commentId
export const editComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  const video = await Video.findOne({ videoId: req.params.videoId });
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const comment = video.comments.find(c => c.commentId === req.params.commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

  const sanitizedText = sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  });

  comment.text = sanitizedText;
  await video.save();
  res.json(comment);
};

// @desc    Delete a comment
// @route   DELETE /api/videos/:videoId/comments/:commentId
export const deleteComment = async (req, res) => {
  const video = await Video.findOne({ videoId: req.params.videoId });
  if (!video) return res.status(404).json({ message: 'Video not found' });

  const commentIndex = video.comments.findIndex(c => c.commentId === req.params.commentId);
  if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });
  
  const comment = video.comments[commentIndex];
  if (comment.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

  video.comments.splice(commentIndex, 1);
  await video.save();
  res.json({ message: 'Comment removed' });
};
