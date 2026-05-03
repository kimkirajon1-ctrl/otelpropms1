const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorization');
const { ROLES } = require('../config/constants');

router.use(auth); // Tüm oda işlemleri giriş gerektirir

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', authorize(ROLES.ADMIN), roomController.createRoom);
router.put('/:id', authorize([ROLES.ADMIN, ROLES.HOUSEKEEPING]), roomController.updateRoom);
router.delete('/:id', authorize(ROLES.ADMIN), roomController.deleteRoom);

module.exports = router;
