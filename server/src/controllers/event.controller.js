const eventService = require("../services/event.service");
const { isOwner } = require("../middlewares/authorize");

// Create event
const createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user._id);
    res.status(201).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

// Get all events
const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await eventService.getEvents(filters, page, limit);
    
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Search events
const searchEvents = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20, ...filters } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }
    
    const result = await eventService.searchEvents(q, filters, page, limit);
    
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get event by ID
const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

// Update event
const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.user._id
    );
    res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
const deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// RSVP to event
const rsvpEvent = async (req, res, next) => {
  try {
    const event = await eventService.rsvpEvent(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "RSVP successful",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

// Cancel RSVP
const cancelRSVP = async (req, res, next) => {
  try {
    const event = await eventService.cancelRSVP(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "RSVP cancelled",
      data: { event },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  searchEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRSVP,
};
