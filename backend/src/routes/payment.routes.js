/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Payment routes
router.post('/:txRef/confirm', paymentController.confirm.bind(paymentController));
router.post('/webhook', paymentController.webhook.bind(paymentController));

module.exports = router;
