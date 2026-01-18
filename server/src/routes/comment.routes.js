const express = require("express");
const { body } = require("express-validator");
const commentController = require("../controllers/comment.controller");
const authenticate = require("../middlewares/authenticate");
const validate = require("../middlewares/validate");

const router = express.Router();

// Add comment validation
const addCommentValidation = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must be less than 1000 characters"),
  validate,
];

// Public route - get comments
router.get("/:id/comments", commentController.getEventComments);

// Protected routes
router.use(authenticate);

router.post("/:id/comments", addCommentValidation, commentController.addComment);
router.delete("/:id/comments/:commentId", commentController.deleteComment);

module.exports = router;
