const db = require('../config/database');

exports.makeReservation = async (data) => {
  const { guest_id, room_id, check_in_date, check_out_date, total_price, created_by } = data;
  
  const query = `
    INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_price, created_by)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;
  const { rows } = await db.query(query, [guest_id, room_id, check_in_date, check_out_date, total_price, created_by]);
  
  // Oda durumunu rezerve olarak güncelle
  await db.query('UPDATE rooms SET status = $1 WHERE id = $2', ['RESERVED', room_id]);
  
  return rows[0];
};

exports.processCheckIn = async (id) => {
  const res = await db.query('UPDATE reservations SET status = $1 WHERE id = $2 RETURNING room_id', ['CHECKED_IN', id]);
  const roomId = res.rows[0].room_id;
  await db.query('UPDATE rooms SET status = $1 WHERE id = $2', ['OCCUPIED', roomId]);
  return { message: 'Check-in tamamlandı' };
};
