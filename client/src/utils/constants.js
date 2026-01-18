export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const EVENT_CATEGORIES = [
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

export const EVENT_LOCATION_TYPES = {
  ONLINE: "online",
  IN_PERSON: "in-person",
};

export const EVENT_STATUS = {
  UPCOMING: "upcoming",
  PAST: "past",
  CANCELLED: "cancelled",
};
