const express = require('express');
const router = express.Router();
const resController = require('../controllers/reservation.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', resController.getAllReservations);
router.post('/', resController.createReservation);
router.get('/:id', resController.getReservationById);
router.patch('/:id/status', resController.updateStatus);
router.post('/:id/check-in', resController.checkIn);
router.post('/:id/check-out', resController.checkOut);

module.exports = router;
