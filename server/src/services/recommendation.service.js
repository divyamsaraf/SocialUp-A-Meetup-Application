const Event = require("../models/event.model");
const User = require("../models/user.model");

// Calculate recommendation score for an event
const calculateEventScore = async (event, user, userLocation) => {
  let score = 0;
  const reasons = [];

  // Interest matching (40% weight)
  if (user.interests && user.interests.length > 0) {
    const interestMatch = user.interests.some(
      interest => event.eventCategory.toLowerCase().includes(interest.toLowerCase()) ||
                   event.title.toLowerCase().includes(interest.toLowerCase()) ||
                   event.description.toLowerCase().includes(interest.toLowerCase())
    );
    if (interestMatch) {
      score += 40;
      reasons.push("Matches your interests");
    }
  }

  // Location proximity (25% weight)
  if (userLocation && event.location && event.location.coordinates) {
    const distance = calculateDistance(
      userLocation.coordinates,
      event.location.coordinates
    );
    // Closer events get higher scores (within 50km gets full points)
    if (distance < 50) {
      const locationScore = Math.max(0, 25 * (1 - distance / 50));
      score += locationScore;
      reasons.push(`Near your location (${Math.round(distance)}km away)`);
    }
  }

  // Trending events - RSVP velocity (20% weight)
  const daysUntilEvent = (new Date(event.dateAndTime) - new Date()) / (1000 * 60 * 60 * 24);
  const rsvpVelocity = event.attendees.length / Math.max(1, daysUntilEvent);
  
  if (rsvpVelocity > 2) {
    score += 20;
    reasons.push("Trending event");
  } else if (rsvpVelocity > 1) {
    score += 10;
    reasons.push("Popular event");
  }

  // Upcoming events preference (10% weight)
  if (daysUntilEvent > 0 && daysUntilEvent < 7) {
    score += 10;
    reasons.push("Happening soon");
  } else if (daysUntilEvent > 0 && daysUntilEvent < 30) {
    score += 5;
  }

  // Avoid events user already RSVP'd to
  if (event.attendees && event.attendees.some(
    attendeeId => attendeeId.toString() === user._id.toString()
  )) {
    score = 0;
    reasons.push("You're already attending");
  }

  // Avoid past events
  if (new Date(event.dateAndTime) < new Date()) {
    score = 0;
    reasons.push("Past event");
  }

  return { score, reasons };
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (coord1, coord2) => {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Get recommendations for a user
const getRecommendations = async (userId, limit = 10) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get user's location if available
  let userLocation = null;
  if (user.location && user.location.coordinates) {
    userLocation = { coordinates: user.location.coordinates };
  }

  // Get upcoming events
  const upcomingEvents = await Event.find({
    dateAndTime: { $gte: new Date() },
    eventStatus: { $ne: "cancelled" },
  })
    .populate("hostedBy", "name username profile_pic")
    .limit(100); // Get more events to score and filter

  // Calculate scores for each event
  const scoredEvents = await Promise.all(
    upcomingEvents.map(async (event) => {
      const { score, reasons } = await calculateEventScore(event, user, userLocation);
      return {
        event: event.toObject(),
        score,
        reasons,
      };
    })
  );

  // Filter out events with score 0 and sort by score
  const recommendations = scoredEvents
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      ...item.event,
      recommendationScore: item.score,
      recommendationReasons: item.reasons,
    }));

  return recommendations;
};

// Get trending events (based on RSVP velocity)
const getTrendingEvents = async (limit = 10) => {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingEvents = await Event.find({
    dateAndTime: { $gte: now, $lte: sevenDaysFromNow },
    eventStatus: { $ne: "cancelled" },
  })
    .populate("hostedBy", "name username profile_pic")
    .limit(50);

  const trendingEvents = upcomingEvents
    .map(event => {
      const daysUntilEvent = (new Date(event.dateAndTime) - now) / (1000 * 60 * 60 * 24);
      const rsvpVelocity = event.attendees.length / Math.max(1, daysUntilEvent);
      return {
        event: event.toObject(),
        velocity: rsvpVelocity,
      };
    })
    .sort((a, b) => b.velocity - a.velocity)
    .slice(0, limit)
    .map(item => item.event);

  return trendingEvents;
};

module.exports = {
  getRecommendations,
  getTrendingEvents,
};
