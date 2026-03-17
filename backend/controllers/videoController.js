import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Get all videos (with search & filter options)
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res) => {
  const { search, category, channelId } = req.query;

  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (channelId) {
    query.channelId = channelId;
  }

  try {
    const videos = await Video.find(query)
      .populate('uploader', 'username avatar')
      .populate('channelId', 'channelName channelBanner');

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username avatar')
      .populate('channelId', 'channelName subscribers avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload new video details
// @route   POST /api/videos
// @access  Private
const uploadVideo = async (req, res) => {
  const { title, description, thumbnailUrl, videoUrl, category, channelId } = req.body;

  try {
    const channel = await Channel.findById(channelId);

    if (!channel || channel.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to upload to this channel' });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category,
      channelId,
      uploader: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
// @access  Private
const updateVideo = async (req, res) => {
  const { title, description, thumbnailUrl, category } = req.body;

  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this video' });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnailUrl = thumbnailUrl || video.thumbnailUrl;
    video.category = category || video.category;

    const updatedVideo = await video.save();
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this video' });
    }

    await video.deleteOne();
    res.status(200).json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Dislike Video
// @route   PUT /api/videos/:id/react
// @access  Private
const reactToVideo = async (req, res) => {
  const { action } = req.body; // 'like' or 'dislike'

  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (action === 'like') {
      video.likes += 1;
    } else if (action === 'dislike') {
      video.dislikes += 1;
    }

    await video.save();
    res.status(200).json({ likes: video.likes, dislikes: video.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getVideos, getVideoById, uploadVideo, updateVideo, deleteVideo, reactToVideo };
