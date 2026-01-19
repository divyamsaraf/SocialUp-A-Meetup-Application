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

// Generate unique username from email
const generateUniqueUsername = async (email, baseUsername = null) => {
  let username = baseUsername;
  
  // If no base username provided, generate from email
  if (!username && email) {
    const emailPrefix = email.split('@')[0];
    // Remove non-alphanumeric characters, convert to lowercase
    const sanitized = emailPrefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
    // Ensure minimum length
    username = sanitized.length >= 3 ? sanitized : sanitized + '123';
  }
  
  // Ensure username meets requirements
  if (!username || username.length < 3) {
    username = 'user' + Math.floor(Math.random() * 100000);
  }
  
  // Check if username exists, append number if needed
  let finalUsername = username;
  let counter = 1;
  while (await User.findOne({ username: finalUsername })) {
    finalUsername = `${username}${counter}`;
    counter++;
    // Prevent infinite loop
    if (counter > 10000) {
      finalUsername = `${username}${Date.now()}`;
      break;
    }
  }
  
  return finalUsername;
};

// Register new user
const register = async (userData) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Generate unique username if not provided
  if (!userData.username) {
    userData.username = await generateUniqueUsername(userData.email, userData.username);
  } else {
    // Check if provided username is already taken
    const usernameTaken = await User.findOne({ username: userData.username.toLowerCase().trim() });
    if (usernameTaken) {
      throw new Error("Username is already taken");
    }
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
