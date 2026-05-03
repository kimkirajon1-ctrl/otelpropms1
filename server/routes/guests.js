const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', guestController.getAllGuests);
router.post('/', guestController.createGuest);
router.get('/:id', guestController.getGuestById);
router.put('/:id', guestController.updateGuest);

module.exports = router;
