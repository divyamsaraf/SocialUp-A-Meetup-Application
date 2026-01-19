const userService = require("../services/user.service");

/**
 * Server-Side Profile Redirect Middleware
 * 
 * Handles server-side redirects for old /profile/:id URLs.
 * This ensures:
 * - SEO-friendly redirects (308 Permanent Redirect)
 * - Crawler support
 * - Direct cold load support
 * - Social preview support
 * 
 * Usage: Add before serving SPA in server.js
 * 
 * Behavior:
 * 1. Check if request path matches /profile/:param
 * 2. If param is ObjectId, fetch user by ID
 * 3. Redirect (308) to /profile/:username
 * 4. If not ObjectId or user not found, continue to next middleware
 */
const profileRedirect = async (req, res, next) => {
  // Only handle GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Check if path matches /profile/:param pattern
  const profileMatch = req.path.match(/^\/profile\/([^\/]+)$/);
  if (!profileMatch) {
    return next();
  }

  const param = profileMatch[1];
  
  // Check if param is a MongoDB ObjectId (24 hex characters)
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(param);
  
  if (!isObjectId) {
    // Not an ObjectId, assume it's a username - proceed normally
    return next();
  }
  
  // It's an ObjectId - try to find user and redirect to username
  try {
    const user = await userService.getUserById(param);
    
    if (user && user.username) {
      // User found - redirect to username-based URL (308 Permanent Redirect)
      // 308 preserves request method (GET) and is SEO-friendly
      const redirectUrl = `/profile/${user.username}`;
      
      // Preserve query string if present
      const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
      const finalUrl = redirectUrl + queryString;
      
      return res.redirect(308, finalUrl);
    }
    
    // User not found - continue to next middleware (will show 404)
    return next();
  } catch (error) {
    // Error fetching user - continue to next middleware (will show 404)
    return next();
  }
};

module.exports = profileRedirect;
