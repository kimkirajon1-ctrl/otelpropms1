const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/environment');

exports.registerUser = async (userData) => {
  const { username, password, full_name, email, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO users (username, password, full_name, email, role)
    VALUES ($1, $2, $3, $4, $5) RETURNING id, username, role;
  `;
  const { rows } = await db.query(query, [username, hashedPassword, full_name, email, role]);
  return rows[0];
};

exports.loginUser = async (username, password) => {
  const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Hatalı kullanıcı adı veya şifre');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  return { token, user: { id: user.id, username: user.username, role: user.role } };
};

exports.getUserById = async (id) => {
  const { rows } = await db.query('SELECT id, username, full_name, email, role FROM users WHERE id = $1', [id]);
  return rows[0];
};
