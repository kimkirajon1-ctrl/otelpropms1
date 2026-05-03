const db = require('../config/database');

exports.fetchAllRooms = async (filters) => {
  let query = 'SELECT * FROM rooms';
  const params = [];
  
  if (filters.status) {
    query += ' WHERE status = $1';
    params.push(filters.status);
  }
  
  query += ' ORDER BY room_number ASC';
  const { rows } = await db.query(query, params);
  return rows;
};

exports.editRoom = async (id, roomData) => {
  const { status, price_per_night } = roomData;
  const query = 'UPDATE rooms SET status = $1, price_per_night = $2 WHERE id = $3 RETURNING *';
  const { rows } = await db.query(query, [status, price_per_night, id]);
  return rows[0];
};
