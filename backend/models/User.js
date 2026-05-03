const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    department: {
      type: String,
      enum: ["FRONT_OFFICE", "HOUSEKEEPING", "ADMIN"]
    },
    role: {
      type: String,
      enum: ["MANAGER", "STAFF", "ADMIN"]
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ON_LEAVE"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
