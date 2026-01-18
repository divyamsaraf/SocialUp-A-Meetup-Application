const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const router = express.Router();

// Register validation rules
const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  validate,
];

// Login validation rules
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  validate,
];

// Routes
router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
