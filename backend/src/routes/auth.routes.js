/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/profile', AuthMiddleware.authenticate, authController.getProfile.bind(authController));
router.post('/change-password', AuthMiddleware.authenticate, authController.changePassword.bind(authController));

module.exports = router;
