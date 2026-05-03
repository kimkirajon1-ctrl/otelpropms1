const { Pool } = require('pg');
const config = require('./environment');

const pool = new Pool({
  connectionString: config.database.url,
  ssl: config.database.ssl
});

pool.on('connect', () => {
  console.log('PostgreSQL veritabanına başarıyla bağlanıldı.');
});

pool.on('error', (err) => {
  console.error('Beklenmedik veritabanı hatası:', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
