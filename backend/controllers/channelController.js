import Channel from '../models/Channel.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  try {
    const existingChannel = await Channel.findOne({ channelName });

    if (existingChannel) {
      return res.status(400).json({ message: 'Channel name already exists' });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner: channelBanner || 'https://via.placeholder.com/800x200',
      owner: req.user._id,
    });

    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get channel by ID including videos
// @route   GET /api/channels/:id
// @access  Public
const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('owner', 'username avatar');

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const videos = await Video.find({ channelId: channel._id });

    res.status(200).json({
      ...channel._doc,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createChannel, getChannelById };
