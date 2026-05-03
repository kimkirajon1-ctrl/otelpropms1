const dbService = require('../services/report.service');

exports.getStats = async (req, res, next) => {
  try {
    const stats = await dbService.getQuickStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};
