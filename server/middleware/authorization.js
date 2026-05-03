const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Erişim reddedildi. Gerekli yetki: ${roles.join(' veya ')}` 
      });
    }
    next();
  };
};

module.exports = authorize;
