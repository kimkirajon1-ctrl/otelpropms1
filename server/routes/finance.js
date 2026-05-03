const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorization');
const { ROLES } = require('../config/constants');

router.use(auth);
router.use(authorize([ROLES.ADMIN, ROLES.FINANCE]));

router.get('/daily-summary', financeController.getDailySummary);
router.get('/reports', financeController.getFinancialReports);
router.post('/payments', financeController.processPayment);

module.exports = router;
