const roomService = require('../services/room.service');

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.fetchAllRooms(req.query);
    res.status(200).json({ success: true, data: rooms });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.fetchRoomById(req.params.id);
    res.status(200).json({ success: true, data: room });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await roomService.addRoom(req.body);
    res.status(201).json({ success: true, data: newRoom });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await roomService.editRoom(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedRoom });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    await roomService.removeRoom(req.params.id);
    res.status(200).json({ success: true, message: 'Oda başarıyla silindi.' });
  } catch (err) {
    next(err);
  }
};
