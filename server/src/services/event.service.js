const Event = require("../models/event.model");
const { EVENT_STATUS } = require("../config/constants");

// Create event
const createEvent = async (eventData, hostId) => {
  const event = await Event.create({
    ...eventData,
    hostedBy: hostId,
  });
  
  return await Event.findById(event._id).populate("hostedBy", "name username profile_pic");
};

// Get event by ID
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId)
    .populate("hostedBy", "name username profile_pic email")
    .populate("attendees", "name username profile_pic");
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  return event;
};

// Get all events with filters
const getEvents = async (filters = {}, page = 1, limit = 20) => {
  const query = {};
  
  // Apply filters
  if (filters.eventCategory) {
    query.eventCategory = filters.eventCategory;
  }
  
  if (filters.eventLocationType) {
    query.eventLocationType = filters.eventLocationType;
  }
  
  if (filters.eventType) {
    query.eventType = filters.eventType;
  }
  
  if (filters.eventStatus) {
    query.eventStatus = filters.eventStatus;
  }
  
  if (filters.hostedBy) {
    query.hostedBy = filters.hostedBy;
  }
  
  // Date filters
  if (filters.upcoming) {
    query.dateAndTime = { $gte: new Date() };
  }
  
  if (filters.past) {
    query.dateAndTime = { $lt: new Date() };
  }
  
  // Geolocation filter (if coordinates provided)
  if (filters.lat && filters.lng && filters.radius) {
    query["location.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(filters.lng), parseFloat(filters.lat)],
        },
        $maxDistance: parseInt(filters.radius) * 1000, // Convert km to meters
      },
    };
  }
  
  const skip = (page - 1) * limit;
  
  const events = await Event.find(query)
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Event.countDocuments(query);
  
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

// Search events
const searchEvents = async (searchQuery, filters = {}, page = 1, limit = 20) => {
  const query = {
    $or: [
      { title: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
      { eventCategory: { $regex: searchQuery, $options: "i" } },
    ],
  };
  
  // Apply additional filters
  if (filters.eventCategory) {
    query.eventCategory = filters.eventCategory;
  }
  
  if (filters.eventLocationType) {
    query.eventLocationType = filters.eventLocationType;
  }
  
  if (filters.upcoming) {
    query.dateAndTime = { $gte: new Date() };
  }
  
  const skip = (page - 1) * limit;
  
  const events = await Event.find(query)
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Event.countDocuments(query);
  
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

// Update event
const updateEvent = async (eventId, updateData, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (event.hostedBy.toString() !== userId.toString()) {
    throw new Error("You don't have permission to update this event");
  }
  
  Object.assign(event, updateData);
  await event.save();
  
  return await getEventById(eventId);
};

// Delete event
const deleteEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (event.hostedBy.toString() !== userId.toString()) {
    throw new Error("You don't have permission to delete this event");
  }
  
  await Event.findByIdAndDelete(eventId);
  return { message: "Event deleted successfully" };
};

// RSVP to event
const rsvpEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  // Check if already RSVP'd
  if (event.attendees.includes(userId)) {
    throw new Error("You have already RSVP'd to this event");
  }
  
  // Check capacity
  if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
    throw new Error("Event is at full capacity");
  }
  
  // Check if event is past
  if (event.dateAndTime < new Date()) {
    throw new Error("Cannot RSVP to past events");
  }
  
  event.attendees.push(userId);
  await event.save();
  
  return await getEventById(eventId);
};

// Cancel RSVP
const cancelRSVP = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (!event.attendees.includes(userId)) {
    throw new Error("You haven't RSVP'd to this event");
  }
  
  event.attendees = event.attendees.filter(
    (attendeeId) => attendeeId.toString() !== userId.toString()
  );
  await event.save();
  
  return await getEventById(eventId);
};

// Update event status (auto-update based on date)
const updateEventStatus = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }
  
  event.updateStatus();
  await event.save();
  
  return event;
};

module.exports = {
  createEvent,
  getEventById,
  getEvents,
  searchEvents,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
  updateEventStatus,
};
