const Event = require("../models/event.model");

// GET /api/locations/suggest?q=&limit=
// Suggests cities and ZIP codes based on existing event data.
// No hardcoded backend list; this reflects what the dataset actually contains.
const suggestLocations = async (req, res, next) => {
  try {
    const { q = "", limit = 10 } = req.query;
    const needle = String(q || "").trim();
    const safeLimit = Math.min(25, Math.max(1, parseInt(limit) || 10));

    // If no query, return top cities by event count (cold-start)
    if (!needle) {
      const cities = await Event.aggregate([
        { $match: { eventLocationType: "in-person", "location.city": { $exists: true, $ne: "" } } },
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
            type: { $literal: "city" },
            city: "$_id.city",
            state: "$_id.state",
            country: "$_id.country",
            count: 1,
          },
        },
      ]);

      return res.status(200).json({ status: "success", data: { suggestions: cities } });
    }

    const isZipQuery = /^\d{1,10}$/.test(needle);

    const [cities, zips] = await Promise.all([
      Event.aggregate([
        {
          $match: {
            eventLocationType: "in-person",
            "location.city": { $exists: true, $ne: "", $regex: needle, $options: "i" },
          },
        },
        {
          $group: {
            _id: { city: "$location.city", state: "$location.state", country: "$location.country" },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, "_id.city": 1 } },
        { $limit: safeLimit },
        {
          $project: {
            _id: 0,
            type: { $literal: "city" },
            city: "$_id.city",
            state: "$_id.state",
            country: "$_id.country",
            count: 1,
          },
        },
      ]),
      isZipQuery
        ? Event.aggregate([
            {
              $match: {
                eventLocationType: "in-person",
                "location.zipCode": { $exists: true, $ne: "", $regex: `^${needle}`, $options: "i" },
              },
            },
            {
              $group: {
                _id: { zipCode: "$location.zipCode", city: "$location.city", state: "$location.state", country: "$location.country" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1, "_id.zipCode": 1 } },
            { $limit: safeLimit },
            {
              $project: {
                _id: 0,
                type: { $literal: "zip" },
                zipCode: "$_id.zipCode",
                city: "$_id.city",
                state: "$_id.state",
                country: "$_id.country",
                count: 1,
              },
            },
          ])
        : Promise.resolve([]),
    ]);

    // Put city results first for global friendliness, then zips if relevant
    const suggestions = [...cities, ...zips].slice(0, safeLimit);

    res.status(200).json({
      status: "success",
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { suggestLocations };

