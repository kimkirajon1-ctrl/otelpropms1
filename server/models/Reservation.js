const db = require('../config/database');

class Reservation {
  static async findWithDetails() {
    const query = `
      SELECT res.*, g.first_name, g.last_name, r.room_number 
      FROM reservations res
      JOIN guests g ON res.guest_id = g.id
      JOIN rooms r ON res.room_id = r.id
      ORDER BY res.check_in_date DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async updateStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  }
}

module.exports = Reservation;
