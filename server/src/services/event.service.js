const Event = require("../models/event.model");
const { EVENT_STATUS } = require("../config/constants");

const toGeoPoint = (lat, lng) => {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) return null;
  return { type: "Point", coordinates: [parsedLng, parsedLat] };
};

const milesToMeters = (miles) => miles * 1609.34;

// Create event
const createEvent = async (eventData, hostId) => {
  const Group = require("../models/group.model");
  const notificationService = require("./notification.service");

  // Keep existing location.coordinates for UI, but also populate GeoJSON for geo queries
  if (eventData?.location?.coordinates?.lat != null && eventData?.location?.coordinates?.lng != null) {
    const geo = toGeoPoint(eventData.location.coordinates.lat, eventData.location.coordinates.lng);
    if (geo) {
      eventData.location.geo = geo;
    }
  }
  
  const event = await Event.create({
    ...eventData,
    hostedBy: hostId,
  });
  
  const populatedEvent = await Event.findById(event._id).populate("hostedBy", "name username profile_pic");
  
  // If event belongs to a group, notify group members
  if (eventData.groupDetail && eventData.groupDetail.groupId) {
    try {
      const group = await Group.findById(eventData.groupDetail.groupId).populate("members", "name username profile_pic");
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
  
  const hasGeo = filters.lat && filters.lng && (filters.radius || filters.radiusMiles);
  const hasCity = filters.city && String(filters.city).trim();
  const hasZip = filters.zipCode && String(filters.zipCode).trim();

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  // If a location filter is provided, keep behavior recruiter-friendly:
  // - Always include online events
  // - For in-person, apply geo radius or city/zip match
  if (hasGeo || hasCity || hasZip) {
    const baseMatch = { ...query };

    const inPersonMatch = {
      ...baseMatch,
      eventLocationType: "in-person",
    };

    if (hasCity) {
      inPersonMatch["location.city"] = { $regex: `^${String(filters.city).trim()}$`, $options: "i" };
    }
    if (hasZip) {
      inPersonMatch["location.zipCode"] = String(filters.zipCode).trim();
    }

    const onlineMatch = {
      ...baseMatch,
      eventLocationType: "online",
    };

    let inPersonEvents = [];
    if (hasGeo) {
      const radiusMiles = Number(filters.radiusMiles ?? filters.radius);
      const maxDistanceMeters = milesToMeters(radiusMiles);
      const near = toGeoPoint(filters.lat, filters.lng);

      if (near) {
        const agg = await Event.aggregate([
          {
            $geoNear: {
              near,
              key: "location.geo",
              distanceField: "distanceMeters",
              spherical: true,
              maxDistance: maxDistanceMeters,
              query: inPersonMatch,
            },
          },
          { $sort: { dateAndTime: 1 } },
          // fetch enough rows so we can paginate after merging with online
          { $limit: Math.max(100, parsedLimit * 5) },
        ]);
        inPersonEvents = agg.map((e) => ({
          ...e,
          distanceMiles: e.distanceMeters != null ? Number((e.distanceMeters / 1609.34).toFixed(1)) : undefined,
        }));
      }
    } else {
      inPersonEvents = await Event.find(inPersonMatch)
        .populate("hostedBy", "name username profile_pic")
        .sort({ dateAndTime: 1 })
        .limit(Math.max(100, parsedLimit * 5))
        .lean();
    }

    const onlineEvents = await Event.find(onlineMatch)
      .populate("hostedBy", "name username profile_pic")
      .sort({ dateAndTime: 1 })
      .limit(Math.max(100, parsedLimit * 5))
      .lean();

    // Merge and sort by date
    const combined = [...inPersonEvents, ...onlineEvents].sort(
      (a, b) => new Date(a.dateAndTime) - new Date(b.dateAndTime)
    );

    const paged = combined.slice(skip, skip + parsedLimit);

    return {
      events: paged,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: combined.length,
        pages: Math.ceil(combined.length / parsedLimit),
      },
    };
  }
  
  const events = await Event.find(query)
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parsedLimit);
  
  const total = await Event.countDocuments(query);
  
  return {
    events,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit),
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

  // Optional location filter for search results (same semantics as getEvents)
  if (filters.city) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { eventLocationType: "online" },
        { "location.city": { $regex: `^${String(filters.city).trim()}$`, $options: "i" } },
      ],
    });
  }
  if (filters.zipCode) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { eventLocationType: "online" },
        { "location.zipCode": String(filters.zipCode).trim() },
      ],
    });
  }
  
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  const skip = (parsedPage - 1) * parsedLimit;
  
  const events = await Event.find(query)
    .populate("hostedBy", "name username profile_pic")
    .sort({ dateAndTime: 1 })
    .skip(skip)
    .limit(parsedLimit);
  
  const total = await Event.countDocuments(query);
  
  return {
    events,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      pages: Math.ceil(total / parsedLimit),
    },
  };
};

// Update event
const updateEvent = async (eventId, updateData, userId) => {
  const notificationService = require("./notification.service");
  const emailService = require("./email.service");
  const User = require("../models/user.model");
  
  const event = await Event.findById(eventId).populate("attendees", "name username profile_pic");
  
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
  
  const event = await Event.findById(eventId).populate("hostedBy", "name username email");
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
  toGeoPoint,
};
