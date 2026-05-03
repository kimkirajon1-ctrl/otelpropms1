const jwt = require('jsonwebtoken');
const config = require('../config/environment');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme reddedildi. Token bulunamadı.' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş.' });
  }
};

module.exports = auth;
