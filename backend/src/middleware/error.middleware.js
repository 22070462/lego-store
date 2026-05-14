/**
 * Global Error Handler Middleware
 */

const { NODE_ENV } = require('../config/constants');

class ErrorMiddleware {
  /**
   * Handle all errors
   */
  static handle(err, req, res, next) {
    console.error('Error:', err);

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds limit (5MB)',
      });
    }

    if (err.message && err.message.includes('Only image uploads are allowed')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed',
      });
    }

    // Database errors
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({
        success: false,
        message: 'Database constraint violation',
      });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    const response = {
      success: false,
      message,
    };

    // Include stack trace in development
    if (NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Handle 404 Not Found
   */
  static notFound(req, res) {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.url} not found`,
    });
  }
}

module.exports = ErrorMiddleware;
