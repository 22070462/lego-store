/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const uploadMiddleware = require('../middleware/upload.middleware');

// Public routes
router.get('/', productController.getAll.bind(productController));
router.get('/:id', productController.getById.bind(productController));

// Admin routes (these will be /products/... when mounted)
// For /admin/products/... paths, these should be in admin.routes.js instead

module.exports = router;
