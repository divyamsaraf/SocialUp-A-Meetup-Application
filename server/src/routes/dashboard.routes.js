const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get("/upcoming", dashboardController.getUpcoming);
router.get("/feed", dashboardController.getFeed);
router.get("/stats", dashboardController.getStats);

module.exports = router;
