import Video from '../models/Video.js';

// @desc    Add comment to video
// @route   POST /api/videos/:videoId/comments
export const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = {
      commentId: `comment${Date.now()}`,
      userId: req.user.userId,
      text,
      timestamp: new Date(),
    };

    video.comments.push(comment);
    await video.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a video
// @route   GET /api/videos/:videoId/comments
export const getComments = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit a comment
// @route   PUT /api/videos/:videoId/comments/:commentId
export const editComment = async (req, res) => {
  const { text } = req.body;
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const comment = video.comments.find(c => c.commentId === req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    comment.text = text;
    await video.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/videos/:videoId/comments/:commentId
export const deleteComment = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const commentIndex = video.comments.findIndex(c => c.commentId === req.params.commentId);
    if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });
    
    const comment = video.comments[commentIndex];
    if (comment.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    video.comments.splice(commentIndex, 1);
    await video.save();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
