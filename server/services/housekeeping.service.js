const db = require('../config/database');

exports.fetchTasks = async () => {
  const query = `
    SELECT ht.*, r.room_number 
    FROM housekeeping_tasks ht
    JOIN rooms r ON ht.room_id = r.id
    ORDER BY ht.created_at DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

exports.updateStatus = async (id, status) => {
  const query = 'UPDATE housekeeping_tasks SET status = $1, completed_at = $2 WHERE id = $3 RETURNING *';
  const completedAt = status === 'COMPLETED' ? new Date() : null;
  const { rows } = await db.query(query, [status, completedAt, id]);
  return rows[0];
};
