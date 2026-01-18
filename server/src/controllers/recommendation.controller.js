const recommendationService = require("../services/recommendation.service");

const getRecommendations = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const recommendations = await recommendationService.getRecommendations(
      req.user._id,
      parseInt(limit)
    );
    res.status(200).json({
      status: "success",
      data: { recommendations },
    });
  } catch (error) {
    next(error);
  }
};

const getTrendingEvents = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const trendingEvents = await recommendationService.getTrendingEvents(
      parseInt(limit)
    );
    res.status(200).json({
      status: "success",
      data: { events: trendingEvents },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  getTrendingEvents,
};
