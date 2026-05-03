const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, unique: true },
    floor: Number,
    roomType: String,
    price: Number,
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "OCCUPIED",
        "MAINTENANCE",
        "CLEANING"
      ],
      default: "AVAILABLE"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
