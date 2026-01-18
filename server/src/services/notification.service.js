const Notification = require("../models/notification.model");

const createNotification = async (userId, type, title, message, payload = {}) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    payload,
  });

  return notification;
};

const getUserNotifications = async (userId, page = 1, limit = 20, unreadOnly = false) => {
  const query = { userId };
  if (unreadOnly) {
    query.read = false;
  }

  const skip = (page - 1) * limit;

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ userId, read: false });

  return {
    notifications,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    unreadCount,
  };
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );

  return result;
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return { message: "Notification deleted successfully" };
};

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, read: false });
  return count;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
