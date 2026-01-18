const Comment = require("../models/comment.model");
const Event = require("../models/event.model");

// Add comment to event
const addComment = async (eventId, userId, text) => {
  // Verify event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  
  const comment = await Comment.create({
    eventId,
    userId,
    text,
  });
  
  return await Comment.findById(comment._id).populate("userId", "name username profile_pic");
};

// Get comments for event
const getEventComments = async (eventId, page = 1, limit = 20) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  
  const skip = (page - 1) * limit;
  
  const comments = await Comment.find({ eventId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Comment.countDocuments({ eventId });
  
  return {
    comments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Delete comment
const deleteComment = async (commentId, userId, isAdmin = false) => {
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    throw new Error("Comment not found");
  }
  
  // Check if user is owner or admin
  if (comment.userId.toString() !== userId.toString() && !isAdmin) {
    throw new Error("You don't have permission to delete this comment");
  }
  
  await Comment.findByIdAndDelete(commentId);
  return { message: "Comment deleted successfully" };
};

module.exports = {
  addComment,
  getEventComments,
  deleteComment,
};
