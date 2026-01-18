const express = require("express");
const { body } = require("express-validator");
const groupController = require("../controllers/group.controller");
const authenticate = require("../middlewares/authenticate");
const { isOwnerOrAdmin } = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const Group = require("../models/group.model");

const router = express.Router();

const createGroupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ max: 200 })
    .withMessage("Group name must be less than 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Group description is required")
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Group category is required"),
  body("privacy")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Privacy must be 'public' or 'private'"),
  validate,
];

const updateGroupValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Group name must be less than 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be less than 5000 characters"),
  body("category")
    .optional()
    .trim(),
  body("privacy")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Privacy must be 'public' or 'private'"),
  validate,
];

router.get("/", groupController.getGroups);
router.get("/:id", groupController.getGroupById);
router.get("/:id/events", groupController.getGroupEvents);

router.use(authenticate);

router.post("/", createGroupValidation, groupController.createGroup);

router.put(
  "/:id",
  updateGroupValidation,
  async (req, res, next) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        return res.status(404).json({
          status: "error",
          message: "Group not found",
        });
      }
      const isOrganizer = group.organizer.toString() === req.user._id.toString();
      const isModerator = group.moderators.some(
        (modId) => modId.toString() === req.user._id.toString()
      );
      if (!isOrganizer && !isModerator) {
        return res.status(403).json({
          status: "error",
          message: "You don't have permission to update this group",
        });
      }
      req.resourceOwner = group.organizer;
      next();
    } catch (error) {
      next(error);
    }
  },
  groupController.updateGroup
);

router.delete(
  "/:id",
  async (req, res, next) => {
    try {
      const group = await Group.findById(req.params.id);
      if (!group) {
        return res.status(404).json({
          status: "error",
          message: "Group not found",
        });
      }
      req.resourceOwner = group.organizer;
      next();
    } catch (error) {
      next(error);
    }
  },
  isOwnerOrAdmin,
  groupController.deleteGroup
);

router.post("/:id/join", groupController.joinGroup);
router.post("/:id/leave", groupController.leaveGroup);
router.post("/:id/moderators", groupController.addModerator);

module.exports = router;
