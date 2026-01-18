const Event = require("../models/event.model");
const User = require("../models/user.model");

// Get user's upcoming events
const getUpcomingEvents = async (userId) => {
  const events = await Event.find({
    attendees: userId,
    dateAndTime: { $gte: new Date() },
    eventStatus: { $ne: "cancelled" },
  })
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .limit(20);
  
  return events;
};

// Get personalized feed
const getPersonalizedFeed = async (userId, page = 1, limit = 20) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  // Build query based on user interests and RSVP history
  const query = {
    dateAndTime: { $gte: new Date() },
    eventStatus: { $ne: "cancelled" },
  };
  
  // If user has interests, prioritize events in those categories
  if (user.interests && user.interests.length > 0) {
    query.eventCategory = { $in: user.interests };
  }
  
  const skip = (page - 1) * limit;
  
  // Get events user hasn't RSVP'd to yet
  const events = await Event.find({
    ...query,
    attendees: { $ne: userId },
  })
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Event.countDocuments({
    ...query,
    attendees: { $ne: userId },
  });
  
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

// Get user statistics
const getUserStats = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  const eventsCreated = await Event.countDocuments({ hostedBy: userId });
  const eventsRSVPd = await Event.countDocuments({ attendees: userId });
  const upcomingRSVPs = await Event.countDocuments({
    attendees: userId,
    dateAndTime: { $gte: new Date() },
    eventStatus: { $ne: "cancelled" },
  });
  
  return {
    eventsCreated,
    eventsRSVPd,
    upcomingRSVPs,
    interests: user.interests || [],
  };
};

module.exports = {
  getUpcomingEvents,
  getPersonalizedFeed,
  getUserStats,
};
