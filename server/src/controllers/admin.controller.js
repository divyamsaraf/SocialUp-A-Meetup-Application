const adminService = require("../services/admin.service");

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await adminService.getAllUsers(page, limit);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get all events
const getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await adminService.getAllEvents(page, limit);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
const deleteComment = async (req, res, next) => {
  try {
    await adminService.deleteComment(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
const deleteEvent = async (req, res, next) => {
  try {
    await adminService.deleteEvent(req.params.id);
    res.status(200).json({
      status: "success",
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getEvents,
  deleteComment,
  deleteEvent,
};
