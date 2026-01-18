const { USER_ROLES } = require("../config/constants");

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      status: "error",
      message: "Admin access required",
    });
  }

  next();
};

// Check if user is owner of resource
const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  // This will be used with specific routes that set req.resourceOwner
  // Routes should set req.resourceOwner before calling this middleware
  if (req.user._id.toString() !== req.resourceOwner?.toString()) {
    return res.status(403).json({
      status: "error",
      message: "You don't have permission to perform this action",
    });
  }

  next();
};

// Check if user is owner OR admin
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  const isOwner = req.user._id.toString() === req.resourceOwner?.toString();
  const isAdmin = req.user.role === USER_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      status: "error",
      message: "You don't have permission to perform this action",
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isOwner,
  isOwnerOrAdmin,
};
