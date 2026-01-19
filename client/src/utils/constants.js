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

// Product messaging (kept configurable for reuse)
export const MESSAGING = {
  hero: {
    headline: "Where interests turn into real-world connections",
    subheadline:
      "Join groups to meet people, make friends, find support, grow ideas, and explore what you care about — online and in person.",
    primaryCta: "Explore Events",
    secondaryCta: "Create a Group",
  },
  valueProps: [
    {
      icon: "👥",
      title: "Meet people who share your interests",
    },
    {
      icon: "🗓️",
      title: "Thousands of events — online and in person",
    },
    {
      icon: "🌱",
      title: "Turn shared interests into lasting connections",
    },
  ],
  eventsIntro:
    "Discover events happening near you — or join online experiences from anywhere.",
  emptyStates: {
    events: "No events nearby yet — start one and bring people together around what you love.",
    groups: "Your interests could be someone else's next friendship.",
    dashboardUpcoming: "No upcoming events yet — find one that matches your interests.",
  },
  groups: {
    createHeading: "Great communities start with shared interests.",
    createSubheading:
      "Create a group to meet people, support each other, and grow together.",
  },
  dashboard: {
    welcomeLine: "This is your space to turn interests into real connections.",
  },
};
