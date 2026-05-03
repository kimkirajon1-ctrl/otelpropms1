const db = require('../config/database');

class Room {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM rooms ORDER BY room_number ASC');
    return rows;
  }

  static async updateStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return rows[0];
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    return rows[0];
  }
}

module.exports = Room;
