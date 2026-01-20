const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const router = express.Router();

// Update profile validation
const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("professionalTitle")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Professional title must be less than 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters"),
  body("location")
    .optional()
    .trim(),
  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array"),
  validate,
];

// Public routes
// Username route must come before :id route to avoid conflicts
router.get("/username/:username", userController.getUserByUsername);
router.get("/search", userController.searchUsers);

// IMPORTANT: /me must come before /:id to avoid route conflicts
// Express matches routes in order, so /me must be defined before /:id
// Apply authenticate middleware directly to /me route
router.get("/me", authenticate, userController.getMyProfile);

// Public routes that use :id parameter (must come after /me)
router.get("/:id", userController.getUserById);
router.get("/:id/events", userController.getUserEvents);
router.get("/:id/groups", userController.getUserGroups);

// Protected routes (require authentication for all routes below)
router.use(authenticate);

// Update current user profile
router.put("/me", updateProfileValidation, userController.updateMyProfile);

// Upload profile picture
router.post(
  "/me/avatar",
  userController.upload.single("avatar"),
  userController.uploadAvatar
);

module.exports = router;
