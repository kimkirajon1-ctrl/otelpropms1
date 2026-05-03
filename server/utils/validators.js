const { body } = require('express-validator');

exports.reservationValidationRules = [
  body('guest_id').isInt().withMessage('Geçerli bir misafir ID gereklidir'),
  body('room_id').isInt().withMessage('Geçerli bir oda ID gereklidir'),
  body('check_in_date').isDate().withMessage('Geçerli bir giriş tarihi giriniz'),
  body('check_out_date').isDate().withMessage('Geçerli bir çıkış tarihi giriniz'),
  body('check_out_date').custom((value, { req }) => {
    if (new Date(value) <= new Date(req.body.check_in_date)) {
      throw new Error('Çıkış tarihi giriş tarihinden sonra olmalıdır');
    }
    return true;
  })
];
