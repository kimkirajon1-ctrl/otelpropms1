const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  roomType: { type: String, enum: ["SINGLE", "DOUBLE", "SUITE"], default: "SINGLE" },
  status: { 
    type: String, 
    enum: ["AVAILABLE", "OCCUPIED", "CLEANING", "MAINTENANCE"], 
    default: "AVAILABLE" 
  },
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
