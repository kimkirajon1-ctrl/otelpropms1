const db = require('../config/database');

class AuditLog {
  static async log(userId, action, tableName, recordId, oldValues = null, newValues = null) {
    const query = `
      INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const { rows } = await db.query(query, [userId, action, tableName, recordId, oldValues, newValues]);
    return rows[0];
  }
}

module.exports = AuditLog;
