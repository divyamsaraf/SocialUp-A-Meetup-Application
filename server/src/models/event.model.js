const mongoose = require("mongoose");
const { EVENT_TYPES, EVENT_LOCATION_TYPES, EVENT_STATUS } = require("../config/constants");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title must be less than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [5000, "Description must be less than 5000 characters"],
    },
    hostedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Event host is required"],
    },
    dateAndTime: {
      type: Date,
      required: [true, "Event date and time is required"],
    },
    eventType: {
      type: String,
      enum: Object.values(EVENT_TYPES),
      default: EVENT_TYPES.EVENT,
    },
    eventCategory: {
      type: String,
      required: [true, "Event category is required"],
      trim: true,
    },
    eventLocationType: {
      type: String,
      enum: Object.values(EVENT_LOCATION_TYPES),
      required: [true, "Event location type is required"],
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    eventImage: { type: String },
    maxAttendees: {
      type: Number,
      min: [1, "Max attendees must be at least 1"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    eventStatus: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.UPCOMING,
    },
    groupDetail: {
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
      },
      groupName: { type: String },
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
eventSchema.index({ dateAndTime: 1 });
eventSchema.index({ eventCategory: 1 });
eventSchema.index({ eventLocationType: 1 });
eventSchema.index({ hostedBy: 1 });
eventSchema.index({ eventStatus: 1 });
eventSchema.index({ "location.coordinates": "2dsphere" }); // For geolocation queries

// Virtual to check if event is full
eventSchema.virtual("isFull").get(function () {
  if (!this.maxAttendees) return false;
  return this.attendees.length >= this.maxAttendees;
});

// Method to automatically update event status based on date
eventSchema.methods.updateStatus = function () {
  const now = new Date();
  if (this.eventStatus === EVENT_STATUS.CANCELLED) {
    return; // Don't auto-update cancelled events
  }
  
  if (this.dateAndTime < now) {
    this.eventStatus = EVENT_STATUS.PAST;
  } else {
    this.eventStatus = EVENT_STATUS.UPCOMING;
  }
};

// Pre-save hook to update status
eventSchema.pre("save", function (next) {
  if (this.isModified("dateAndTime") || this.isNew) {
    this.updateStatus();
  }
  next();
});

const Event = mongoose.model("event", eventSchema);
module.exports = Event;
