// Event Types
const EVENT_TYPES = {
  EVENT: "event",
  GROUP: "group",
};

// Event Location Types
const EVENT_LOCATION_TYPES = {
  ONLINE: "online",
  IN_PERSON: "in-person",
};

// Event Status
const EVENT_STATUS = {
  UPCOMING: "upcoming",
  PAST: "past",
  CANCELLED: "cancelled",
};

// User Roles
const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Event Categories (common Meetup categories)
const EVENT_CATEGORIES = [
  "Tech",
  "Business",
  "Arts & Culture",
  "Sports & Recreation",
  "Health & Wellness",
  "Food & Drink",
  "Music",
  "Photography",
  "Travel",
  "Education",
  "Social",
  "Other",
];

module.exports = {
  EVENT_TYPES,
  EVENT_LOCATION_TYPES,
  EVENT_STATUS,
  USER_ROLES,
  EVENT_CATEGORIES,
};
