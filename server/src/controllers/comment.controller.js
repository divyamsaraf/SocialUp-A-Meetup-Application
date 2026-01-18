const commentService = require("../services/comment.service");

// Add comment to event
const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(
      req.params.id,
      req.user._id,
      req.body.text
    );
    res.status(201).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

// Get comments for event
const getEventComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await commentService.getEventComments(
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

// Delete comment
const deleteComment = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";
    await commentService.deleteComment(
      req.params.commentId,
      req.user._id,
      isAdmin
    );
    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getEventComments,
  deleteComment,
};
