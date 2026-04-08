import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Get all videos
// @route   GET /api/videos
export const getVideos = async (req, res) => {
  const { search, category } = req.query;
  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category && category !== 'All') query.category = category;

  try {
    const videos = await Video.find(query);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:videoId
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (video) res.json(video);
    else res.status(404).json({ message: 'Video not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload video
// @route   POST /api/videos
export const uploadVideo = async (req, res) => {
  try {
    const videoIdStr = `video${Date.now()}`;
    const video = await Video.create({
      ...req.body,
      videoId: videoIdStr,
      uploader: req.user.userId,
    });

    // Update the channel's video array
    const channel = await Channel.findOne({ channelId: req.body.channelId });
    if (channel) {
      channel.videos.push(videoIdStr);
      await channel.save();
    }

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:videoId
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    Object.assign(video, req.body);
    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:videoId
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });
    if (video.uploader !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

    // Remove from channel's video array
    const channel = await Channel.findOne({ channelId: video.channelId });
    if (channel) {
      channel.videos = channel.videos.filter(id => id !== video.videoId);
      await channel.save();
    }

    await video.deleteOne();
    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like video
// @route   POST /api/videos/:videoId/like
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (video) {
        video.likes += 1;
        await video.save();
        res.json({ likes: video.likes });
    } else res.status(404).json({ message: 'Not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Dislike video
// @route   POST /api/videos/:videoId/dislike
export const dislikeVideo = async (req, res) => {
    try {
      const video = await Video.findOne({ videoId: req.params.videoId });
      if (video) {
          video.dislikes += 1;
          await video.save();
          res.json({ dislikes: video.dislikes });
      } else res.status(404).json({ message: 'Not found' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};
