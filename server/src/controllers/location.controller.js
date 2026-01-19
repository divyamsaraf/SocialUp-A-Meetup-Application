const https = require("https");

// GET /api/locations/suggest?q=&limit=
// Suggests cities and ZIP codes using OpenStreetMap Nominatim API.
// Provides comprehensive location suggestions with coordinates for any location.
const suggestLocations = async (req, res, next) => {
  try {
    const { q = "", limit = 10 } = req.query;
    const needle = String(q || "").trim();
    const safeLimit = Math.min(25, Math.max(1, parseInt(limit) || 10));

    // If no query, return popular US cities as default suggestions
    if (!needle) {
      const defaultCities = [
        { city: "New York", state: "NY", zipCode: null, lat: 40.7128, lng: -74.006, label: "New York, NY" },
        { city: "Los Angeles", state: "CA", zipCode: null, lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
        { city: "Chicago", state: "IL", zipCode: null, lat: 41.8781, lng: -87.6298, label: "Chicago, IL" },
        { city: "Houston", state: "TX", zipCode: null, lat: 29.7604, lng: -95.3698, label: "Houston, TX" },
        { city: "Phoenix", state: "AZ", zipCode: null, lat: 33.4484, lng: -112.074, label: "Phoenix, AZ" },
        { city: "Philadelphia", state: "PA", zipCode: null, lat: 39.9526, lng: -75.1652, label: "Philadelphia, PA" },
        { city: "San Antonio", state: "TX", zipCode: null, lat: 29.4241, lng: -98.4936, label: "San Antonio, TX" },
        { city: "San Diego", state: "CA", zipCode: null, lat: 32.7157, lng: -117.1611, label: "San Diego, CA" },
        { city: "Dallas", state: "TX", zipCode: null, lat: 32.7767, lng: -96.797, label: "Dallas, TX" },
        { city: "San Jose", state: "CA", zipCode: null, lat: 37.3382, lng: -121.8863, label: "San Jose, CA" },
      ];
      return res.status(200).json({
        status: "success",
        data: { suggestions: defaultCities.slice(0, safeLimit) },
      });
    }

    // Check if query is a ZIP code (5 digits, optionally with extension)
    const isZipQuery = /^\d{5}(-\d{4})?$/.test(needle.trim());

    // Build Nominatim API URL
    let url;
    if (isZipQuery) {
      // Search by postal code
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(needle.trim())}&format=jsonv2&limit=${safeLimit}&addressdetails=1&countrycodes=us`;
    } else {
      // Search by city name
      url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(needle.trim())}&format=jsonv2&limit=${safeLimit}&addressdetails=1&countrycodes=us`;
    }

    // Fetch from Nominatim API
    const suggestions = await fetchNominatimSuggestions(url);

    res.status(200).json({
      status: "success",
      data: { suggestions },
    });
  } catch (error) {
    console.error("Location suggestion error:", error);
    next(error);
  }
};

// Helper function to fetch suggestions from Nominatim API
const fetchNominatimSuggestions = (url) => {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "SocialUp/1.0",
            "Accept-Language": "en",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              const results = JSON.parse(data);

              // Transform Nominatim results to our format
              const suggestions = results
                .map((item) => {
                  const addr = item.address || {};
                  const city = addr.city || addr.town || addr.village || addr.municipality || addr.county;
                  const state = addr.state || addr.region;
                  const zipCode = addr.postcode;

                  if (!city && !zipCode) return null;

                  return {
                    city: city || null,
                    state: state || null,
                    zipCode: zipCode || null,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                    displayName: item.display_name,
                    label:
                      zipCode && city && state
                        ? `${zipCode} — ${city}, ${state}`
                        : city && state
                        ? `${city}, ${state}`
                        : city || zipCode || "Unknown",
                  };
                })
                .filter(Boolean);

              resolve(suggestions);
            } catch (parseError) {
              reject(new Error("Failed to parse Nominatim response: " + parseError.message));
            }
          });
        }
      )
      .on("error", (error) => {
        reject(new Error("Nominatim API request failed: " + error.message));
      });
  });
};

module.exports = { suggestLocations };

