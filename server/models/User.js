const db = require('../config/database');

class User {
  static async findByUsername(username) {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT id, username, full_name, email, role, is_active FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  static async create({ username, password, full_name, email, role }) {
    const query = `
      INSERT INTO users (username, password, full_name, email, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role;
    `;
    const { rows } = await db.query(query, [username, password, full_name, email, role]);
    return rows[0];
  }
}

module.exports = User;
