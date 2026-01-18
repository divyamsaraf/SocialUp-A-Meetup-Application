const express = require("express");
const adminController = require("../controllers/admin.controller");
const authenticate = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/authorize");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

router.get("/users", adminController.getUsers);
router.get("/events", adminController.getEvents);
router.delete("/comments/:id", adminController.deleteComment);
router.delete("/events/:id", adminController.deleteEvent);

module.exports = router;
