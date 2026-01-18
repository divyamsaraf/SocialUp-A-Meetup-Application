const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "event",
      required: [true, "Event ID is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [1000, "Comment must be less than 1000 characters"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Indexes for better query performance
commentSchema.index({ eventId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

// Populate user details when querying
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "userId",
    select: "name username profile_pic",
  });
  next();
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
