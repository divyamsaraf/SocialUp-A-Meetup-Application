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

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get("/me", userController.getMyProfile);

// Update current user profile
router.put("/me", updateProfileValidation, userController.updateMyProfile);

// Upload profile picture
router.post(
  "/me/avatar",
  userController.upload.single("avatar"),
  userController.uploadAvatar
);

// Get user by ID (public)
router.get("/:id", userController.getUserById);

// Get user's events
router.get("/:id/events", userController.getUserEvents);

// Search users
router.get("/search", userController.searchUsers);

module.exports = router;
