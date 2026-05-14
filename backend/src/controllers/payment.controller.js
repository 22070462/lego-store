/**
 * Payment Controller
 * Handles payment-related HTTP requests
 */

const paymentService = require('../services/payment.service');
const ResponseHelper = require('../utils/response.helper');

class PaymentController {
  /**
   * Confirm payment
   * POST /payments/:txRef/confirm
   */
  async confirm(req, res) {
    try {
      const { txRef } = req.params;

      if (!txRef) {
        return ResponseHelper.validationError(res, {
          txRef: 'Transaction reference is required',
        });
      }

      const result = await paymentService.confirmPayment(txRef);

      return ResponseHelper.success(res, result.message, result);
    } catch (error) {
      if (error.message === 'Transaction not found') {
        return ResponseHelper.notFound(res, 'Transaction');
      }
      if (error.message === 'Transaction is not pending') {
        return ResponseHelper.error(res, error.message, 400);
      }
      if (error.message.includes('Not enough stock')) {
        return ResponseHelper.error(res, error.message, 400);
      }
      console.error('Confirm payment error:', error);
      return ResponseHelper.error(res, 'Failed to confirm payment');
    }
  }

  /**
   * Payment webhook
   * POST /payments/webhook
   */
  async webhook(req, res) {
    try {
      const { tx_ref, status } = req.body;

      if (!tx_ref || !status) {
        return ResponseHelper.validationError(res, {
          tx_ref: !tx_ref ? 'Transaction reference is required' : null,
          status: !status ? 'Status is required' : null,
        });
      }

      const validStatuses = ['paid', 'failed', 'cancelled'];
      if (!validStatuses.includes(status.toLowerCase())) {
        return ResponseHelper.error(res, 'Invalid status', 400);
      }

      if (status.toLowerCase() === 'paid') {
        const result = await paymentService.confirmPayment(tx_ref);
        return ResponseHelper.success(res, 'Webhook processed', result);
      }

      // Handle failed/cancelled status
      const paymentRepository = require('../repositories/payment.repository');
      const tx = await paymentRepository.findByTxRef(tx_ref);

      if (!tx) {
        return ResponseHelper.notFound(res, 'Transaction');
      }

      await paymentRepository.updateStatus(tx.id, status.toLowerCase());

      return ResponseHelper.success(res, 'Webhook processed', {
        tx_ref,
        status: status.toLowerCase(),
      });
    } catch (error) {
      console.error('Webhook error:', error);
      return ResponseHelper.error(res, 'Webhook processing failed');
    }
  }
}

module.exports = new PaymentController();
