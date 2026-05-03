const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { username, password, full_name, email, role } = req.body;
    const user = await authService.registerUser({ username, password, full_name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser(username, password);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
