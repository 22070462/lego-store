/**
 * Payment Service
 * Business logic for payment processing
 */

const crypto = require('crypto');
const paymentRepository = require('../repositories/payment.repository');
const orderRepository = require('../repositories/order.repository');
const productRepository = require('../repositories/product.repository');
const orderItemRepository = require('../repositories/order-item.repository');
const database = require('../config/database');
const {
  TAX_RATE,
  SHIPPING_THRESHOLD,
  SHIPPING_COST,
  QR_EXPIRE_MINUTES,
} = require('../config/constants');

class PaymentService {
  /**
   * Normalize order items
   */
  normalizeItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((it) => ({
        productId: String(it.productId ?? it.id ?? '').trim(),
        qty: Number(it.qty || 0),
      }))
      .filter((it) => it.productId && Number.isFinite(it.qty) && it.qty > 0);
  }

  /**
   * Calculate order totals
   */
  calcTotals(orderItems) {
    const subtotal = this.toMoney(
      orderItems.reduce((sum, it) => {
        return sum + Number(it.price) * Number(it.qty);
      }, 0)
    );

    const tax = this.toMoney(subtotal * TAX_RATE);
    const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = this.toMoney(subtotal + tax + shipping);

    return {
      subtotal,
      tax,
      shipping: this.toMoney(shipping),
      total,
    };
  }

  /**
   * Generate QR payment data
   */
  generateQrData(orderId, amount) {
    const txRef = this.randomRef('TX');
    const expiresAt = this.addMinutesIso(QR_EXPIRE_MINUTES);
    const qrPayload = this.generateQrPayload({ orderId, txRef, amount, expiresAt });
    const qrText = `playarena://pay?payload=${encodeURIComponent(qrPayload)}`;

    return {
      txRef,
      expiresAt,
      qrPayload,
      qrText,
    };
  }

  /**
   * Confirm payment by transaction reference
   */
  async confirmPayment(txRef) {
    const tx = await paymentRepository.findByTxRef(txRef);

    if (!tx) {
      throw new Error('Transaction not found');
    }

    if (tx.status === 'paid') {
      return {
        message: 'Already paid',
        tx_ref: txRef,
        order_id: tx.order_id,
        order_status: 'confirmed',
      };
    }

    if (tx.status !== 'pending') {
      throw new Error('Transaction is not pending');
    }

    // Begin transaction
    await database.runAsync('BEGIN TRANSACTION');

    try {
      // Get order items with stock info
      const items = await database.allAsync(
        `SELECT oi.product_id, oi.qty, p.stock, p.name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [tx.order_id]
      );

      // Check stock availability
      for (const item of items) {
        if (Number(item.stock || 0) < Number(item.qty || 0)) {
          throw new Error(`Not enough stock for ${item.name}`);
        }
      }

      // Mark payment as paid
      await paymentRepository.markAsPaid(tx.id);

      // Update order status
      await orderRepository.updateStatus(tx.order_id, 'confirmed');

      // Decrement stock
      for (const item of items) {
        await productRepository.decrementStock(Number(item.product_id), Number(item.qty));
      }

      await database.runAsync('COMMIT');

      return {
        message: 'Payment confirmed',
        tx_ref: txRef,
        order_id: tx.order_id,
        order_status: 'confirmed',
      };
    } catch (error) {
      await database.runAsync('ROLLBACK');
      throw error;
    }
  }

  // Helper methods
  toMoney(n) {
    return Number(Number(n || 0).toFixed(2));
  }

  addMinutesIso(minutes) {
    const d = new Date(Date.now() + minutes * 60 * 1000);
    return d.toISOString();
  }

  randomRef(prefix) {
    return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
  }

  generateQrPayload(data) {
    const payload = {
      provider: 'mock_qr',
      order_id: data.orderId,
      tx_ref: data.txRef,
      amount: this.toMoney(data.amount),
      currency: 'USD',
      expires_at: data.expiresAt,
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

module.exports = new PaymentService();
