const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env = require("../config/env");

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      }
    },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register new user
const register = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Create user
  const user = await User.create(userData);
  
  // Generate token
  const token = generateToken(user);

  // Return user without password
  const userObj = user.toJSON();
  
  return { user: userObj, token };
};

// Login user
const login = async (email, password) => {
  // Find user and include password for comparison
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  const isPasswordValid = user.checkPassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user);

  // Return user without password
  const userObj = user.toJSON();
  
  return { user: userObj, token };
};

// Get current user
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user.toJSON();
};

module.exports = {
  register,
  login,
  getCurrentUser,
  generateToken,
};
