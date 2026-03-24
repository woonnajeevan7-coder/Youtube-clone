import Channel from '../models/Channel.js';
import Video from '../models/Video.js';

// @desc    Create a new channel
// @route   POST /api/channels
export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;
  
  if (!channelName || !description) {
    return res.status(400).json({ message: 'Channel name and description are required' });
  }

  try {
    const channel = await Channel.create({
      channelId: `channel${Date.now()}`,
      channelName,
      description,
      channelBanner,
      owner: req.user.userId,
    });
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get channel info & its videos
// @route   GET /api/channels/:channelId
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const videos = await Video.find({ channelId: req.params.channelId });
    res.json({ channel, videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
