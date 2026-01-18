const Event = require("../models/event.model");

// Check if user can RSVP
const canRSVP = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    return { canRSVP: false, reason: "Event not found" };
  }
  
  // Check if already RSVP'd
  if (event.attendees.includes(userId)) {
    return { canRSVP: false, reason: "Already RSVP'd" };
  }
  
  // Check capacity
  if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
    return { canRSVP: false, reason: "Event is at full capacity" };
  }
  
  // Check if event is past
  if (event.dateAndTime < new Date()) {
    return { canRSVP: false, reason: "Cannot RSVP to past events" };
  }
  
  return { canRSVP: true };
};

// Get RSVP status
const getRSVPStatus = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  
  if (!event) {
    return { isRSVPd: false };
  }
  
  const isRSVPd = event.attendees.some(
    (attendeeId) => attendeeId.toString() === userId.toString()
  );
  
  return {
    isRSVPd,
    attendeeCount: event.attendees.length,
    maxAttendees: event.maxAttendees,
    isFull: event.maxAttendees ? event.attendees.length >= event.maxAttendees : false,
  };
};

module.exports = {
  canRSVP,
  getRSVPStatus,
};
