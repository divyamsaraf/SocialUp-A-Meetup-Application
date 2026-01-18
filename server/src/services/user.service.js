const User = require("../models/user.model");

// Get user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.toJSON();
};

// Update user profile
const updateProfile = async (userId, updateData) => {
  // Remove password from update data if present (handled separately)
  const { password, ...safeUpdateData } = updateData;
  
  const user = await User.findByIdAndUpdate(
    userId,
    safeUpdateData,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new Error("User not found");
  }
  
  return user.toJSON();
};

// Update password
const updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  user.password = newPassword;
  await user.save();
  
  return user.toJSON();
};

// Get user's created events
const getUserEvents = async (userId) => {
  const Event = require("../models/event.model");
  const events = await Event.find({ hostedBy: userId })
    .select("title dateAndTime eventCategory eventLocationType attendees eventStatus eventImage")
    .sort({ dateAndTime: -1 });
  
  return events;
};

// Search users
const searchUsers = async (query, limit = 20) => {
  const searchRegex = new RegExp(query, "i");
  
  const users = await User.find({
    $or: [
      { name: searchRegex },
      { username: searchRegex },
      { email: searchRegex },
    ],
  })
    .limit(limit)
    .select("name username email profile_pic bio location interests");
  
  return users.map((user) => user.toJSON());
};

// Get user's groups
const getUserGroups = async (userId) => {
  const Group = require("../models/group.model");
  const groups = await Group.find({
    $or: [
      { organizer: userId },
      { members: userId },
    ],
  })
    .populate("organizer", "name username profile_pic")
    .sort({ createdAt: -1 });
  
  return groups;
};

module.exports = {
  getUserById,
  updateProfile,
  updatePassword,
  getUserEvents,
  searchUsers,
  getUserGroups,
};
