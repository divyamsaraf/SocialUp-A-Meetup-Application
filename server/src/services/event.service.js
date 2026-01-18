const Event = require("../models/event.model");
const { EVENT_STATUS } = require("../config/constants");

// Create event
const createEvent = async (eventData, hostId) => {
  const Group = require("../models/group.model");
  const notificationService = require("./notification.service");
  
  const event = await Event.create({
    ...eventData,
    hostedBy: hostId,
  });
  
  const populatedEvent = await Event.findById(event._id).populate("hostedBy", "name username profile_pic");
  
  // If event belongs to a group, notify group members
  if (eventData.groupDetail && eventData.groupDetail.groupId) {
    try {
      const group = await Group.findById(eventData.groupDetail.groupId).populate("members");
      if (group && group.members) {
        const notificationPromises = group.members
          .filter(member => member._id.toString() !== hostId.toString())
          .map(member =>
            notificationService.createNotification(
              member._id,
              "event_created",
              "New Event in Group",
              `A new event "${event.title}" was created in ${group.name}`,
              { eventId: event._id, eventTitle: event.title, groupId: group._id }
            )
          );
        await Promise.all(notificationPromises);
      }
    } catch (error) {
      console.error("Failed to notify group members:", error);
    }
  }
  
  return populatedEvent;
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
  const notificationService = require("./notification.service");
  const emailService = require("./email.service");
  const User = require("../models/user.model");
  
  const event = await Event.findById(eventId).populate("attendees");
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (event.hostedBy.toString() !== userId.toString()) {
    throw new Error("You don't have permission to update this event");
  }
  
  const oldData = {
    title: event.title,
    dateAndTime: event.dateAndTime,
    description: event.description,
  };
  
  Object.assign(event, updateData);
  await event.save();
  
  const updatedEvent = await getEventById(eventId);
  
  // Notify attendees of event update
  if (event.attendees && event.attendees.length > 0) {
    try {
      const changes = {};
      if (updateData.title && updateData.title !== oldData.title) {
        changes.title = `${oldData.title} → ${updateData.title}`;
      }
      if (updateData.dateAndTime && updateData.dateAndTime !== oldData.dateAndTime) {
        changes.date = `${oldData.dateAndTime} → ${updateData.dateAndTime}`;
      }
      
      if (Object.keys(changes).length > 0) {
        const notificationPromises = event.attendees.map(attendee => {
          const attendeeId = typeof attendee === 'object' ? attendee._id : attendee;
          return notificationService.createNotification(
            attendeeId,
            "event_update",
            "Event Updated",
            `The event "${event.title}" has been updated`,
            { eventId: event._id, eventTitle: event.title, changes }
          );
        });
        
        await Promise.all(notificationPromises);
        
        // Send emails to attendees
        const emailPromises = event.attendees
          .filter(attendee => attendee.email)
          .map(attendee =>
            emailService.sendEventUpdate(
              attendee.email,
              attendee.name || attendee.username,
              event.title,
              changes
            )
          );
        await Promise.all(emailPromises);
      }
    } catch (error) {
      console.error("Failed to notify attendees of update:", error);
    }
  }
  
  return updatedEvent;
};

// Delete event
const deleteEvent = async (eventId, userId) => {
  const notificationService = require("./notification.service");
  const emailService = require("./email.service");
  
  const event = await Event.findById(eventId).populate("attendees", "email name username");
  
  if (!event) {
    throw new Error("Event not found");
  }
  
  if (event.hostedBy.toString() !== userId.toString()) {
    throw new Error("You don't have permission to delete this event");
  }
  
  // Notify attendees before deleting
  if (event.attendees && event.attendees.length > 0) {
    try {
      const notificationPromises = event.attendees.map(attendee => {
        const attendeeId = typeof attendee === 'object' ? attendee._id : attendee;
        return notificationService.createNotification(
          attendeeId,
          "event_cancellation",
          "Event Cancelled",
          `The event "${event.title}" has been cancelled`,
          { eventId: event._id, eventTitle: event.title }
        );
      });
      
      await Promise.all(notificationPromises);
      
      // Send cancellation emails
      const emailPromises = event.attendees
        .filter(attendee => attendee && attendee.email)
        .map(attendee =>
          emailService.sendEventCancellation(
            attendee.email,
            attendee.name || attendee.username,
            event.title
          )
        );
      await Promise.all(emailPromises);
    } catch (error) {
      console.error("Failed to notify attendees of cancellation:", error);
    }
  }
  
  await Event.findByIdAndDelete(eventId);
  return { message: "Event deleted successfully" };
};

// RSVP to event
const rsvpEvent = async (eventId, userId) => {
  const User = require("../models/user.model");
  const notificationService = require("./notification.service");
  const emailService = require("./email.service");
  
  const event = await Event.findById(eventId).populate("hostedBy", "name email");
  const user = await User.findById(userId);
  
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
  
  // Send notification and email
  try {
    await notificationService.createNotification(
      userId,
      "rsvp_confirmation",
      "RSVP Confirmed",
      `You've successfully RSVP'd to ${event.title}`,
      { eventId: event._id, eventTitle: event.title }
    );
    
    if (user && user.email) {
      await emailService.sendRSVPConfirmation(
        user.email,
        user.name || user.username,
        event.title,
        event.dateAndTime
      );
    }
  } catch (error) {
    // Log but don't fail the RSVP if notification fails
    console.error("Failed to send RSVP notification:", error);
  }
  
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
