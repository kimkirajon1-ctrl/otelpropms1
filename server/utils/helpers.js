/**
 * Rastgele işlem numarası (Transaction ID) üretir
 */
exports.generateTransactionId = () => {
  return `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Objedeki boş değerleri temizler
 */
exports.cleanObject = (obj) => {
  Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);
  return obj;
};
