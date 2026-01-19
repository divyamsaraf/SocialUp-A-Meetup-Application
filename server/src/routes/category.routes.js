const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/authorize");
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");

const router = express.Router();

// Public route - get all active categories
router.get("/", getCategories);

// Admin routes - require authentication and admin role
router.post("/", authenticate, isAdmin, createCategory);
router.put("/:id", authenticate, isAdmin, updateCategory);
router.delete("/:id", authenticate, isAdmin, deleteCategory);

module.exports = router;
