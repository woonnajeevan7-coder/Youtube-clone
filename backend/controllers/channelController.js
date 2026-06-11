import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import crypto from 'crypto';

// @desc    Create a new channel
// @route   POST /api/channels
export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;
  
  if (!channelName || !description) {
    return res.status(400).json({ message: 'Channel name and description are required' });
  }

  try {
    const channel = await Channel.create({
      channelId: `channel_${crypto.randomUUID()}`,
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

// @desc    Toggle subscription to a channel
// @route   POST /api/channels/:channelId/subscribe
export const subscribeChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const user = req.user; // populated by protect middleware
    const isSubscribed = user.channels.includes(channel.channelId);
    let updatedSubscribers = channel.subscribers;

    if (isSubscribed) {
      // Unsubscribe atomically
      await User.updateOne({ userId: user.userId }, { $pull: { channels: channel.channelId } });
      await Channel.updateOne({ channelId: channel.channelId }, { $inc: { subscribers: -1 } });
      updatedSubscribers = Math.max(0, updatedSubscribers - 1);
    } else {
      // Subscribe atomically
      await User.updateOne({ userId: user.userId }, { $addToSet: { channels: channel.channelId } });
      await Channel.updateOne({ channelId: channel.channelId }, { $inc: { subscribers: 1 } });
      updatedSubscribers += 1;
    }

    res.json({
      isSubscribed: !isSubscribed,
      subscribers: updatedSubscribers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check subscription status
// @route   GET /api/channels/:channelId/isSubscribed
export const checkSubscription = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const isSubscribed = req.user ? req.user.channels.includes(channel.channelId) : false;
    res.json({
      isSubscribed,
      subscribers: channel.subscribers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

