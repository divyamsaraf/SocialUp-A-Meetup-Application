const express = require("express");
const { body } = require("express-validator");
const eventController = require("../controllers/event.controller");
const commentController = require("../controllers/comment.controller");
const authenticate = require("../middlewares/authenticate");
const { isOwnerOrAdmin } = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const Event = require("../models/event.model");
const { getEventSuggestions } = require("../controllers/eventSuggestions.controller");

const router = express.Router();

// Create event validation
const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be less than 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("dateAndTime")
    .notEmpty()
    .withMessage("Date and time is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("eventCategory")
    .trim()
    .notEmpty()
    .withMessage("Event category is required"),
  body("eventLocationType")
    .isIn(["online", "in-person"])
    .withMessage("Event location type must be 'online' or 'in-person'"),
  body("maxAttendees")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max attendees must be at least 1"),
  validate,
];

// Update event validation (same as create, but all fields optional)
const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title must be less than 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("dateAndTime")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  body("eventCategory")
    .optional()
    .trim(),
  body("eventLocationType")
    .optional()
    .isIn(["online", "in-person"])
    .withMessage("Event location type must be 'online' or 'in-person'"),
  body("maxAttendees")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max attendees must be at least 1"),
  validate,
];

// Public routes
router.get("/suggestions", getEventSuggestions);
router.get("/", eventController.getEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id/comments", commentController.getEventComments);
router.get("/:id", eventController.getEventById);

// Protected routes (require authentication)
router.use(authenticate);

router.post("/:id/comments", 
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must be less than 1000 characters"),
  validate,
  commentController.addComment
);

router.delete("/:id/comments/:commentId", commentController.deleteComment);

router.post("/", createEventValidation, eventController.createEvent);

// Check ownership before update/delete
router.put(
  "/:id",
  updateEventValidation,
  async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({
          status: "error",
          message: "Event not found",
        });
      }
      req.resourceOwner = event.hostedBy;
      next();
    } catch (error) {
      next(error);
    }
  },
  isOwnerOrAdmin,
  eventController.updateEvent
);

router.delete(
  "/:id",
  async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({
          status: "error",
          message: "Event not found",
        });
      }
      req.resourceOwner = event.hostedBy;
      next();
    } catch (error) {
      next(error);
    }
  },
  isOwnerOrAdmin,
  eventController.deleteEvent
);

// RSVP routes
router.post("/:id/rsvp", eventController.rsvpEvent);
router.delete("/:id/rsvp", eventController.cancelRSVP);

module.exports = router;
