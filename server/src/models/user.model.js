const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { USER_ROLES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
      match: [/^[a-z0-9_-]+$/, "Username can only contain lowercase letters, numbers, hyphens, and underscores"],
      index: true, // Add index for faster lookups
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    name: { type: String, trim: true },
    professionalTitle: { type: String, trim: true, maxlength: [100, "Professional title must be less than 100 characters"] },
    location: { type: String, trim: true },
    interests: { 
      type: [String], 
      default: [] 
    },
    profile_pic: { 
      type: String, 
      default: "https://img.icons8.com/ios-filled/50/000000/user-male-circle.png" 
    },
    bio: { type: String, maxlength: [500, "Bio must be less than 500 characters"] },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Normalize username: lowercase, trim (before validation)
userSchema.pre("validate", function (next) {
  // Normalize username: lowercase, trim
  if (this.username) {
    this.username = this.username.toLowerCase().trim();
  }
  next();
});

// Hash password before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  
  const hash = bcrypt.hashSync(this.password, 8);
  this.password = hash;
  return next();
});

// Method to check password
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Method to exclude password from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
