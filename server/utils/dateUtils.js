const dayjs = require('dayjs');

/**
 * İki tarih arasındaki gece sayısını hesaplar
 */
exports.calculateNights = (checkIn, checkOut) => {
  const start = dayjs(checkIn);
  const end = dayjs(checkOut);
  const nights = end.diff(start, 'day');
  return nights > 0 ? nights : 0;
};

/**
 * Tarihi veritabanı veya UI için formatlar
 */
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

/**
 * Verilen tarihin bugün olup olmadığını kontrol eder
 */
exports.isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};
