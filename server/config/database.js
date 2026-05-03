// server/config/database.js
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.local')
});

const logger = require('../middleware/logger');

// Environment değişkenleri
const DB_CONFIG = {
  development: {
    user: process.env.DB_USER || 'hotel_pms_user',
    password: process.env.DB_PASSWORD || 'secure_password_123',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hotel_pms_dev',
  },
  test: {
    user: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'hotel_pms_test',
  },
  production: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const config = DB_CONFIG[NODE_ENV];

// Connection pool yapılandırması
const pool = new Pool({
  ...config,
  max: process.env.DB_POOL_MAX || 20,
  min: process.env.DB_POOL_MIN || 2,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT || 30000,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT || 2000,
  statement_timeout: 30000, // 30 saniye
  ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Pool event handlers
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message });
  process.exit(-1);
});

pool.on('connect', () => {
  logger.info('New client connected to database');
});

pool.on('remove', () => {
  logger.info('Client
