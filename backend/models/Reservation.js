const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    reservationId: String,
    guestName: String,
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    checkInDate: Date,
    checkOutDate: Date,
    status: {
      type: String,
      enum: ["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
