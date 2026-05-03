const morgan = require('morgan');

// Morgan kullanarak özelleştirilmiş log yapısı
const logger = morgan(':method :url :status :res[content-length] - :response-time ms');

module.exports = logger;
