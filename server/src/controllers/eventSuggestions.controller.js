const Event = require("../models/event.model");

// GET /api/events/suggestions?q=
// Returns popular cities (by event count) and optional search matches.
const getEventSuggestions = async (req, res, next) => {
  try {
    const { q = "", limit = 8 } = req.query;
    const safeLimit = Math.min(20, Math.max(1, parseInt(limit) || 8));

    const match = {
      "location.city": { $exists: true, $ne: "" },
      eventLocationType: "in-person",
    };

    if (q && String(q).trim()) {
      match["location.city"] = { $regex: String(q).trim(), $options: "i" };
    }

    const suggestions = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            city: "$location.city",
            state: "$location.state",
            country: "$location.country",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1, "_id.city": 1 } },
      { $limit: safeLimit },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          state: "$_id.state",
          country: "$_id.country",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEventSuggestions };

