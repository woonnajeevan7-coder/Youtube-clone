import Notification from '../models/Notification.js';
import crypto from 'crypto';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();
  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({ notificationId: req.params.notificationId });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  if (notification.userId !== req.user.userId) return res.status(401).json({ message: 'Not authorized' });

  notification.isRead = true;
  await notification.save();
  res.json(notification);
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });
  res.json({ message: 'All notifications marked as read' });
};

// Internal utility to create notifications
export const createNotification = async (userId, text) => {
  try {
    await Notification.create({
      notificationId: `notif_${crypto.randomUUID()}`,
      userId,
      text,
      isRead: false
    });
  } catch (err) {
    console.error('Failed to create notification', err);
  }
};
