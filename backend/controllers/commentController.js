import Comment from '../models/Comment.js';

// @desc    Add comment to video
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  const { videoId, text } = req.body;

  try {
    const comment = await Comment.create({
      text,
      userId: req.user._id,
      videoId,
    });

    const populatedComment = await comment.populate('userId', 'username avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comments for a video
// @route   GET /api/comments/:videoId
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    comment.text = text;
    const updatedComment = await comment.save();

    const populatedComment = await updatedComment.populate('userId', 'username avatar');
    res.status(200).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addComment, getComments, updateComment, deleteComment };
