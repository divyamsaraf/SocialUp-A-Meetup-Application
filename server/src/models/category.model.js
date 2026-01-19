const mongoose = require("mongoose");

/**
 * Category Model - Admin-editable event categories
 * Allows admins to add, remove, and update categories without code changes
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Category name must be less than 100 characters"],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    // Special category types
    isSpecial: {
      type: Boolean,
      default: false,
    },
    specialType: {
      type: String,
      enum: ["events_near", "all_events", "new_groups"],
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Index for efficient queries
categorySchema.index({ isActive: 1, displayOrder: 1 });

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
