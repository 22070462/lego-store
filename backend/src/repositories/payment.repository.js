/**
 * Payment Repository
 * Data access layer for payment_transactions table
 */

const database = require('../config/database');

class PaymentRepository {
  /**
   * Find payment by transaction reference
   */
  async findByTxRef(txRef) {
    return await database.getAsync(
      'SELECT * FROM payment_transactions WHERE tx_ref = ?',
      [txRef]
    );
  }

  /**
   * Find payment by order ID
   */
  async findByOrderId(orderId) {
    return await database.getAsync(
      `SELECT * FROM payment_transactions 
       WHERE order_id = ? 
       ORDER BY id DESC LIMIT 1`,
      [orderId]
    );
  }

  /**
   * Create payment transaction
   */
  async create(paymentData) {
    const {
      order_id,
      tx_ref,
      method,
      amount,
      qr_payload,
      qr_text,
      qr_expires_at,
      status,
    } = paymentData;

    const result = await database.runAsync(
      `INSERT INTO payment_transactions(
        order_id, tx_ref, method, amount, qr_payload, qr_text, 
        qr_expires_at, status, created_at, updated_at
      ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [order_id, tx_ref, method, amount, qr_payload || '', qr_text || '', qr_expires_at, status || 'pending']
    );

    return result.lastID;
  }

  /**
   * Update payment status
   */
  async updateStatus(id, status) {
    await database.runAsync(
      `UPDATE payment_transactions 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, id]
    );
  }

  /**
   * Mark payment as paid
   */
  async markAsPaid(id) {
    await database.runAsync(
      `UPDATE payment_transactions 
       SET status = 'paid', paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [id]
    );
  }

  /**
   * Find expired pending payments
   */
  async findExpiredPending() {
    return await database.allAsync(
      `SELECT * FROM payment_transactions 
       WHERE status = 'pending' 
       AND datetime(qr_expires_at) < datetime('now')`,
      []
    );
  }

  /**
   * Count payments by status
   */
  async countByStatus(status) {
    const result = await database.getAsync(
      'SELECT COUNT(*) as count FROM payment_transactions WHERE status = ?',
      [status]
    );
    return result.count;
  }
}

module.exports = new PaymentRepository();
