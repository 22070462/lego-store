/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');
const ResponseHelper = require('../utils/response.helper');

class AuthMiddleware {
  /**
   * Verify JWT token and attach user to request
   */
  static authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return ResponseHelper.unauthorized(res, 'No token provided');
      }

      const token = authHeader.slice(7);

      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return ResponseHelper.unauthorized(res, 'Token expired');
        }
        return ResponseHelper.unauthorized(res, 'Invalid token');
      }
    } catch (error) {
      return ResponseHelper.error(res, 'Authentication failed');
    }
  }

  /**
   * Verify user is admin
   */
  static async requireAdmin(req, res, next) {
    try {
      const userRepository = require('../repositories/user.repository');
      const user = await userRepository.findById(req.user.id);

      if (!user) {
        return ResponseHelper.unauthorized(res, 'User not found');
      }

      if (user.role !== 'admin') {
        return ResponseHelper.forbidden(res, 'Admin access required');
      }

      next();
    } catch (error) {
      return ResponseHelper.error(res, 'Authorization failed');
    }
  }

  /**
   * Optional authentication (doesn't fail if no token)
   */
  static optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          req.user = decoded;
        } catch (error) {
          // Silently fail for optional auth
        }
      }

      next();
    } catch (error) {
      next();
    }
  }
}

module.exports = AuthMiddleware;
