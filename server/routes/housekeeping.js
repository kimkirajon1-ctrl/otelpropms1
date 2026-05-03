const express = require('express');
const router = express.Router();
const hkController = require('../controllers/housekeeping.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorization');
const { ROLES } = require('../config/constants');

router.use(auth);

router.get('/tasks', hkController.getTasks);
router.post('/tasks', authorize([ROLES.ADMIN, ROLES.HOUSEKEEPING]), hkController.createTask);
router.patch('/tasks/:id', hkController.updateTaskStatus);

module.exports = router;
