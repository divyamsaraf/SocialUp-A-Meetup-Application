const authService = require("../services/auth.service");

// Register new user
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    
    res.status(201).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    
    res.status(200).json({
      status: "success",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user (authenticated)
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
