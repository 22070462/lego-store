/**
 * Express Application Configuration
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { CORS_ORIGIN } = require('./config/constants');
const routes = require('./routes');
const ErrorMiddleware = require('./middleware/error.middleware');

class App {
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  configureMiddleware() {
    // CORS
    this.app.use(cors({
      origin: CORS_ORIGIN,
      credentials: true,
    }));

    // Body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Static files (frontend)
    this.app.use(express.static(path.join(__dirname, '..', '..')));

    // Uploads directory
    this.app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
  }

  configureRoutes() {
    // API routes
    this.app.use('/api', routes);

    // Legacy routes (backward compatibility)
    this.app.use('/', routes);
  }

  configureErrorHandling() {
    // 404 handler
    this.app.use(ErrorMiddleware.notFound);

    // Global error handler
    this.app.use(ErrorMiddleware.handle);
  }

  getApp() {
    return this.app;
  }
}

module.exports = new App().getApp();
