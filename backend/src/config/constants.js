/**
 * Application Constants
 * Centralized configuration values
 */

require('dotenv').config();

module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  HOST: process.env.HOST || 'localhost',

  // Database
  DB_PATH: process.env.DB_PATH || './users.db',

  // Authentication
  JWT_SECRET: process.env.JWT_SECRET || 'supersecretkey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,

  // Default Admin
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || 'admin@playarena.local',
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',

  // Payment
  TAX_RATE: parseFloat(process.env.TAX_RATE) || 0.08,
  SHIPPING_THRESHOLD: parseFloat(process.env.SHIPPING_THRESHOLD) || 100,
  SHIPPING_COST: parseFloat(process.env.SHIPPING_COST) || 10,
  QR_EXPIRE_MINUTES: parseInt(process.env.QR_EXPIRE_MINUTES, 10) || 15,
  VND_EXCHANGE_RATE: parseInt(process.env.VND_EXCHANGE_RATE, 10) || 25000,

  // File Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp').split(','),

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Stock
  LOW_STOCK_THRESHOLD: 10,
};
