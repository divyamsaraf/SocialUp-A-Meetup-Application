const express = require("express");
const { suggestLocations } = require("../controllers/location.controller");

const router = express.Router();

router.get("/suggest", suggestLocations);

module.exports = router;

