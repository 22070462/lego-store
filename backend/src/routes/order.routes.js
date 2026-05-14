/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

// User routes (protected)
router.post('/', AuthMiddleware.authenticate, orderController.create.bind(orderController));
router.get('/', AuthMiddleware.authenticate, orderController.getUserOrders.bind(orderController));
router.get('/:id', AuthMiddleware.authenticate, orderController.getDetail.bind(orderController));

module.exports = router;
