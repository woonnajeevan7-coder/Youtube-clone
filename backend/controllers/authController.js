import User from '../models/User.js';
import Video from '../models/Video.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generates a short-lived access token (expires in 15 minutes)
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

// Generates a long-lived refresh token (expires in 30 days)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Sets token cookies securely using HttpOnly, SameSite, and Secure options
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userId: `user_${crypto.randomUUID()}`,
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);
      setCookies(res, accessToken, refreshToken);

      res.status(201).json({
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        token: accessToken,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user.userId);
      const refreshToken = generateRefreshToken(user.userId);
      setCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Logout user & clear cookies
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

/**
 * @desc    Refresh expired access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.id });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user.userId);
    const newRefreshToken = generateRefreshToken(user.userId);
    setCookies(res, newAccessToken, newRefreshToken);

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Token refresh failed' });
  }
};

/**
 * @desc    Add video to user watch history
 * @route   POST /api/auth/history
 * @access  Private
 */
export const addWatchHistory = async (req, res) => {
  const { videoId } = req.body;
  if (!videoId) return res.status(400).json({ message: 'videoId is required' });

  try {
    const video = await Video.findOne({ videoId });
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // Avoid duplicate history items, keep fresh LIFO
    req.user.watchHistory = req.user.watchHistory.filter(id => !id.equals(video._id));
    req.user.watchHistory.unshift(video._id);

    await req.user.save();
    res.json(req.user.watchHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get user watch history list
 * @route   GET /api/auth/history
 * @access  Private
 */
export const getWatchHistory = async (req, res) => {
  try {
    const populatedUser = await User.findOne({ userId: req.user.userId })
      .populate({
        path: 'watchHistory',
        match: { isDeleted: { $ne: true } }
      });
    res.json(populatedUser.watchHistory || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
