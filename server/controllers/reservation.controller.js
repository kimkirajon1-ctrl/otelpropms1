const resService = require('../services/reservation.service');

exports.createReservation = async (req, res, next) => {
  try {
    const reservationData = { ...req.body, created_by: req.user.id };
    const reservation = await resService.makeReservation(reservationData);
    res.status(201).json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const result = await resService.processCheckIn(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const result = await resService.processCheckOut(req.params.id);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.getAllReservations = async (req, res, next) => {
  try {
    const reservations = await resService.fetchAll(req.query);
    res.status(200).json({ success: true, data: reservations });
  } catch (err) {
    next(err);
  }
};
