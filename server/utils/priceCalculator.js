const { calculateNights } = require('./dateUtils');

/**
 * Rezervasyon toplam tutarını hesaplar
 */
exports.calculateTotalStayPrice = (checkIn, checkOut, pricePerNight, discounts = 0) => {
  const nights = calculateNights(checkIn, checkOut);
  const subtotal = nights * pricePerNight;
  const total = subtotal - discounts;
  
  return {
    nights,
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(total.toFixed(2))
  };
};
