// server/config/environment.js
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.local')
});

const logger = require('../middleware/logger');

/**
 * Environment Configuration
 * Tüm ortam değişkenlerini merkezi olarak yönetir
 */

const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  TEST: 'test',
  PRODUCTION: 'production',
};

const NODE_ENV = process.env.NODE_ENV || ENVIRONMENTS.DEVELOPMENT;

// Zorunlu ortam değişkenlerini kontrol et
const requiredEnvVars = [
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const requiredProdEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_NAME',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

if (NODE_ENV === ENVIRONMENTS.PRODUCTION) {
  const missing = requiredProdEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missing.length > 0) {
    logger.error('Missing required environment variables', {
      missing: missing.join(', '),
    });
    process.exit(1);
  }
}

const environment = {
  // Node ortamı
  nodeEnv: NODE_ENV,
  isDevelopment: NODE_ENV === ENVIRONMENTS.DEVELOPMENT,
  isTest: NODE_ENV === ENVIRONMENTS.TEST,
  isProduction: NODE_ENV === ENVIRONMENTS.PRODUCTION,

  // Server konfigürasyonu
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3000,
    host: process.env.SERVER_HOST || 'localhost',
    apiPrefix: process.env.API_PREFIX || '/api',
    corsOrigin: process.env.CORS_ORIGIN || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    trustProxy: process.env.TRUST_PROXY === 'true',
  },

  // Veritabanı konfigürasyonu
  database: {
    user: process.env.DB_USER || 'hotel_pms_user',
    password: process.env.DB_PASSWORD || 'secure_password_123',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'hotel_pms_dev',
    ssl: NODE_ENV === ENVIRONMENTS.PRODUCTION,
    poolMax: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    poolMin: parseInt(process.env.DB_POOL_MIN, 10) || 2,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) || 2000,
  },

  // JWT konfigürasyonu
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Loglama konfigürasyonu
  logging: {
    level: process.env.LOG_LEVEL || (NODE_ENV === ENVIRONMENTS.PRODUCTION ? 'info' : 'debug'),
    format: process.env.LOG_FORMAT || 'json',
    outputDir: process.env.LOG_DIR || path.join(__dirname, '../../logs'),
    maxSize: process.env.LOG_MAX_SIZE || '10m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 14,
  },

  // Email/SMS servisleri
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid', 'smtp', 'aws-ses'
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@hotelpms.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@hotelpms.com',
  },

  sms: {
    provider: process.env.SMS_PROVIDER || 'twilio', // 'twilio', 'aws-sns'
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
  },

  // Ödeme gateway'leri
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'stripe', // 'stripe', 'paypal'
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      mode: process.env.PAYPAL_MODE || 'sandbox',
    },
  },

  // Redis konfigürasyonu (caching ve sessions)
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600, // 1 saat
  },

  // S3/Cloud Storage
  storage: {
    type: process.env.STORAGE_TYPE || 'local', // 'local', 's3', 'gcs'
    local: {
      uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
    },
    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET,
      endpoint: process.env.AWS_S3_ENDPOINT,
    },
  },

  // Otel spesifik ayarları
  hotel: {
    name: process.env.HOTEL_NAME || 'Hotel PMS',
    timezone: process.env.HOTEL_TIMEZONE || 'Europe/Istanbul',
    currency: process.env.HOTEL_CURRENCY || 'TRY',
    checkInTime: process.env.CHECK_IN_TIME || '14:00',
    checkOutTime: process.env.CHECK_OUT_TIME || '12:00',
    maxRooms: parseInt(process.env.MAX_ROOMS, 10) || 200,
    minStayDays: parseInt(process.env.MIN_STAY_DAYS, 10) || 1,
  },

  // Feature flags
  features: {
    enableOverbooking: process.env.ENABLE_OVERBOOKING === 'true',
    enableGuestPortal: process.env.ENABLE_GUEST_PORTAL !== 'false',
    enableChannelManager: process.env.ENABLE_CHANNEL_MANAGER !== 'false',
    enableHousekeeping: process.env.ENABLE_HOUSEKEEPING !== 'false',
    enableReporting: process.env.ENABLE_REPORTING !== 'false',
    enableIntegrations: process.env.ENABLE_INTEGRATIONS !== 'false',
  },

  // Entegrasyon API'ları
  integrations: {
    expedia: {
      enabled: process.env.EXPEDIA_ENABLED === 'true',
      apiKey: process.env.EXPEDIA_API_KEY,
      secretKey: process.env.EXPEDIA_SECRET_KEY,
    },
    booking: {
      enabled: process.env.BOOKING_ENABLED === 'true',
      apiKey: process.env.BOOKING_API_KEY,
    },
    airbnb: {
      enabled: process.env.AIRBNB_ENABLED === 'true',
      apiKey: process.env.AIRBNB_API_KEY,
    },
    googleSheets: {
      enabled: process.env.GOOGLE_SHEETS_ENABLED === 'true',
      apiKey: process.env.GOOGLE_SHEETS_API_KEY,
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    },
  },

  // Rate limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 900000, // 15 dakika
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Security
  security: {
    enableHelmet: process.env.ENABLE_HELMET !== 'false',
    enableCsrf: process.env.ENABLE_CSRF === 'true',
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    passwordHashRounds: parseInt(process.env.PASSWORD_HASH_ROUNDS, 10) || 10,
  },

  // Feature-specific timeouts
  timeouts: {
    reservationLock: parseInt(process.env.RESERVATION_LOCK_TIMEOUT, 10) || 300000, // 5 dakika
    paymentGateway: parseInt(process.env.PAYMENT_TIMEOUT, 10) || 30000, // 30 saniye
    emailQueue: parseInt(process.env.EMAIL_QUEUE_TIMEOUT, 10) || 60000, // 1 dakika
  },
};

// Validasyon
if (!environment.jwt.secret) {
  throw new Error('JWT_SECRET environment variable is required');
}

if (!environment.jwt.refreshSecret) {
  throw new Error('JWT_REFRESH_SECRET environment variable is required');
}

module.exports = environment;
