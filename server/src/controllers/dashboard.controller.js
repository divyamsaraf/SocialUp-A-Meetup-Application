const dashboardService = require("../services/dashboard.service");

// Get upcoming events
const getUpcoming = async (req, res, next) => {
  try {
    const events = await dashboardService.getUpcomingEvents(req.user._id);
    res.status(200).json({
      status: "success",
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};

// Get personalized feed
const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await dashboardService.getPersonalizedFeed(
      req.user._id,
      page,
      limit
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getUserStats(req.user._id);
    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpcoming,
  getFeed,
  getStats,
};
