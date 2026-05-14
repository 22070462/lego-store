/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

const authService = require('../services/auth.service');
const ResponseHelper = require('../utils/response.helper');

class AuthController {
  /**
   * Register new user
   * POST /register
   */
  async register(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return ResponseHelper.validationError(res, {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
        });
      }

      // Register user
      const result = await authService.register(email, password);

      return ResponseHelper.success(res, 'User created successfully', result, 201);
    } catch (error) {
      if (error.message === 'User already exists') {
        return ResponseHelper.error(res, error.message, 400);
      }
      console.error('Register error:', error);
      return ResponseHelper.error(res, 'Registration failed');
    }
  }

  /**
   * Login user
   * POST /login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return ResponseHelper.validationError(res, {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
        });
      }

      // Login user
      const result = await authService.login(email, password);

      return ResponseHelper.success(res, 'Login successful', result);
    } catch (error) {
      if (error.message === 'User not found') {
        return ResponseHelper.unauthorized(res, error.message);
      }
      if (error.message === 'Wrong password') {
        return ResponseHelper.unauthorized(res, error.message);
      }
      console.error('Login error:', error);
      return ResponseHelper.error(res, 'Login failed');
    }
  }

  /**
   * Get user profile
   * GET /profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await authService.getProfile(userId);

      return ResponseHelper.success(res, 'Profile retrieved', user);
    } catch (error) {
      if (error.message === 'User not found') {
        return ResponseHelper.notFound(res, 'User');
      }
      console.error('Get profile error:', error);
      return ResponseHelper.error(res, 'Failed to get profile');
    }
  }

  /**
   * Change password
   * POST /change-password
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return ResponseHelper.validationError(res, {
          oldPassword: !oldPassword ? 'Current password is required' : null,
          newPassword: !newPassword ? 'New password is required' : null,
        });
      }

      await authService.changePassword(userId, oldPassword, newPassword);

      return ResponseHelper.success(res, 'Password changed successfully');
    } catch (error) {
      if (error.message === 'Current password is incorrect') {
        return ResponseHelper.error(res, error.message, 400);
      }
      console.error('Change password error:', error);
      return ResponseHelper.error(res, 'Failed to change password');
    }
  }
}

module.exports = new AuthController();
