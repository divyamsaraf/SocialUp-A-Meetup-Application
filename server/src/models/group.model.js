const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Group name is required"],
      trim: true,
      maxlength: [200, "Group name must be less than 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Group description is required"],
      trim: true,
      maxlength: [5000, "Description must be less than 5000 characters"],
    },
    category: {
      type: String,
      required: [true, "Group category is required"],
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Group organizer is required"],
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    groupImage: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

groupSchema.index({ category: 1 });
groupSchema.index({ organizer: 1 });
groupSchema.index({ privacy: 1 });
groupSchema.index({ name: "text", description: "text" });

groupSchema.virtual("memberCount").get(function () {
  return this.members ? this.members.length : 0;
});

const Group = mongoose.model("group", groupSchema);
module.exports = Group;
