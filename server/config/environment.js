require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 10000,
  jwtSecret: process.env.JWT_SECRET,
  database: {
    url: process.env.DATABASE_URL, // Render'ın verdiği Internal/External URL
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};

// Kritik kontrol
if (!config.database.url) {
  console.error('HATA: DATABASE_URL tanımlanmamış!');
}

module.exports = config;
