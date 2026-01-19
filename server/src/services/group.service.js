const Group = require("../models/group.model");
const Event = require("../models/event.model");

const createGroup = async (groupData, organizerId) => {
  const group = await Group.create({
    ...groupData,
    organizer: organizerId,
    members: [organizerId],
  });

  return await Group.findById(group._id)
    .populate("organizer", "name username profile_pic")
    .populate("members", "name username profile_pic");
};

const getGroupById = async (groupId) => {
  const group = await Group.findById(groupId)
    .populate("organizer", "name username profile_pic email")
    .populate("moderators", "name username profile_pic")
    .populate("members", "name username profile_pic");

  if (!group) {
    throw new Error("Group not found");
  }

  return group;
};

const getGroups = async (filters = {}, page = 1, limit = 20) => {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.privacy) {
    query.privacy = filters.privacy;
  }

  if (filters.organizer) {
    query.organizer = filters.organizer;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const skip = (page - 1) * limit;

  // Handle sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'popularity':
        // Sort by member count (descending)
        sortOption = { members: -1, createdAt: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'members':
        sortOption = { members: -1, createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'relevance':
        // For text search, relevance is handled by MongoDB text search
        // Otherwise default to popularity
        sortOption = { members: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const groups = await Group.find(query)
    .populate("organizer", "name username profile_pic")
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Group.countDocuments(query);

  return {
    groups,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const updateGroup = async (groupId, updateData, userId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const isOrganizer = group.organizer.toString() === userId.toString();
  const isModerator = group.moderators.some(
    (modId) => modId.toString() === userId.toString()
  );

  if (!isOrganizer && !isModerator) {
    throw new Error("You don't have permission to update this group");
  }

  Object.assign(group, updateData);
  await group.save();

  return await getGroupById(groupId);
};

const deleteGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.organizer.toString() !== userId.toString()) {
    throw new Error("Only the organizer can delete the group");
  }

  await Group.findByIdAndDelete(groupId);
  return { message: "Group deleted successfully" };
};

const joinGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.privacy === "private") {
    throw new Error("This is a private group. You need an invitation to join.");
  }

  if (group.members.includes(userId)) {
    throw new Error("You are already a member of this group");
  }

  group.members.push(userId);
  await group.save();

  return await getGroupById(groupId);
};

const leaveGroup = async (groupId, userId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.organizer.toString() === userId.toString()) {
    throw new Error("Organizer cannot leave the group. Transfer ownership or delete the group.");
  }

  if (!group.members.includes(userId)) {
    throw new Error("You are not a member of this group");
  }

  group.members = group.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );

  group.moderators = group.moderators.filter(
    (modId) => modId.toString() !== userId.toString()
  );

  await group.save();

  return await getGroupById(groupId);
};

const getGroupEvents = async (groupId, page = 1, limit = 20) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  const skip = (page - 1) * limit;

  const events = await Event.find({
    "groupDetail.groupId": groupId,
  })
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Event.countDocuments({
    "groupDetail.groupId": groupId,
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

const addModerator = async (groupId, userId, currentUserId) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (group.organizer.toString() !== currentUserId.toString()) {
    throw new Error("Only the organizer can add moderators");
  }

  if (!group.members.includes(userId)) {
    throw new Error("User must be a member before becoming a moderator");
  }

  if (group.moderators.includes(userId)) {
    throw new Error("User is already a moderator");
  }

  group.moderators.push(userId);
  await group.save();

  return await getGroupById(groupId);
};

module.exports = {
  createGroup,
  getGroupById,
  getGroups,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupEvents,
  addModerator,
};
