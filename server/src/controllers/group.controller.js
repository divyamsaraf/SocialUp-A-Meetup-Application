const groupService = require("../services/group.service");

const createGroup = async (req, res, next) => {
  try {
    const group = await groupService.createGroup(req.body, req.user._id);
    res.status(201).json({
      status: "success",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await groupService.getGroups(filters, page, limit);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getGroupById = async (req, res, next) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    const group = await groupService.updateGroup(
      req.params.id,
      req.body,
      req.user._id
    );
    res.status(200).json({
      status: "success",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req, res, next) => {
  try {
    await groupService.deleteGroup(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "Group deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const joinGroup = async (req, res, next) => {
  try {
    const group = await groupService.joinGroup(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "Successfully joined group",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const group = await groupService.leaveGroup(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      message: "Successfully left group",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

const getGroupEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await groupService.getGroupEvents(
      req.params.id,
      page,
      limit
    );
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const addModerator = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const group = await groupService.addModerator(
      req.params.id,
      userId,
      req.user._id
    );
    res.status(200).json({
      status: "success",
      message: "Moderator added successfully",
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getGroupEvents,
  addModerator,
};
