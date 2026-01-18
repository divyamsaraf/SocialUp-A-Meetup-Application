const express = require("express");
const recommendationController = require("../controllers/recommendation.controller");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

router.use(authenticate);

router.get("/", recommendationController.getRecommendations);
router.get("/trending", recommendationController.getTrendingEvents);

module.exports = router;
