/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const productController = require('../controllers/product.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// All admin routes require authentication and admin role
router.use(AuthMiddleware.authenticate);
router.use(AuthMiddleware.requireAdmin);

// User management
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/role', adminController.updateUserRole.bind(adminController));

// Order management
router.get('/orders', adminController.getAllOrders.bind(adminController));
router.patch('/orders/:id/status', adminController.updateOrderStatus.bind(adminController));

// Product management
router.post('/products', uploadMiddleware.single('image'), productController.create.bind(productController));
router.put('/products/:id', uploadMiddleware.single('image'), productController.update.bind(productController));
router.delete('/products/:id', productController.delete.bind(productController));
router.get('/products/low-stock', productController.getLowStock.bind(productController));

module.exports = router;
