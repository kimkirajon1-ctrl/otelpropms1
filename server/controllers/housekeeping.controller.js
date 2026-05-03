const hkService = require('../services/housekeeping.service');

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await hkService.fetchTasks(req.query);
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updatedTask = await hkService.updateStatus(req.params.id, status);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (err) {
    next(err);
  }
};
