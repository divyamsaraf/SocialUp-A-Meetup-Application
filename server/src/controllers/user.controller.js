const userService = require("../services/user.service");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../images/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// Get current user profile
const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user._id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update current user profile
const updateMyProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Upload profile picture
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file uploaded",
      });
    }

    const profilePicUrl = `/images/uploads/${req.file.filename}`;
    const user = await userService.updateProfile(req.user._id, {
      profile_pic: profilePicUrl,
    });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by username
const getUserByUsername = async (req, res, next) => {
  try {
    const user = await userService.getUserByUsername(req.params.username);
    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    next(error);
  }
};

// Get user's events (username only)
const getUserEvents = async (req, res, next) => {
  try {
    // Use username from params (route should be /users/:username/events)
    const username = req.params.username || req.params.id;
    const events = await userService.getUserEvents(username);
    res.status(200).json({
      status: "success",
      data: { events },
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    next(error);
  }
};

// Search users
const searchUsers = async (req, res, next) => {
  try {
    const { q, limit } = req.query;
    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const users = await userService.searchUsers(q, parseInt(limit) || 20);
    res.status(200).json({
      status: "success",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's groups
const getUserGroups = async (req, res, next) => {
  try {
    const groups = await userService.getUserGroups(req.params.id);
    res.status(200).json({
      status: "success",
      data: { groups },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  getUserById,
  getUserByUsername,
  getUserEvents,
  searchUsers,
  getUserGroups,
  upload, // Export multer upload middleware
};
