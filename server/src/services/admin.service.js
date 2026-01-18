const User = require("../models/user.model");
const Event = require("../models/event.model");
const Comment = require("../models/comment.model");

// Get all users
const getAllUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments();
  
  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get all events
const getAllEvents = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const events = await Event.find()
    .populate("hostedBy", "name username email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Event.countDocuments();
  
  return {
    events,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Delete comment (admin)
const deleteComment = async (commentId) => {
  const comment = await Comment.findByIdAndDelete(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }
  return { message: "Comment deleted successfully" };
};

// Delete event (admin)
const deleteEvent = async (eventId) => {
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  return { message: "Event deleted successfully" };
};

module.exports = {
  getAllUsers,
  getAllEvents,
  deleteComment,
  deleteEvent,
};
