/**
 * Order Repository
 * Data access layer for orders table
 */

const database = require('../config/database');

class OrderRepository {
  /**
   * Find order by ID
   */
  async findById(id) {
    return await database.getAsync(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId) {
    return await database.allAsync(
      `SELECT o.id, o.created_at, o.subtotal, o.tax, o.shipping, o.total, o.status,
              p.status AS payment_status, p.tx_ref, p.qr_expires_at
       FROM orders o
       LEFT JOIN payment_transactions p ON p.id = (
         SELECT p2.id FROM payment_transactions p2 
         WHERE p2.order_id = o.id 
         ORDER BY p2.id DESC LIMIT 1
       )
       WHERE o.user_id = ?
       ORDER BY o.id DESC`,
      [userId]
    );
  }

  /**
   * Find all orders (admin)
   */
  async findAll() {
    return await database.allAsync(
      `SELECT o.id, o.created_at, o.status, o.total, u.email as user_email 
       FROM orders o 
       LEFT JOIN users u ON u.id = o.user_id 
       ORDER BY o.id DESC`,
      []
    );
  }

  /**
   * Create new order
   */
  async create(orderData) {
    const { user_id, subtotal, tax, shipping, total, status } = orderData;
    const result = await database.runAsync(
      `INSERT INTO orders(user_id, created_at, subtotal, tax, shipping, total, status) 
       VALUES(?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)`,
      [user_id, subtotal, tax, shipping, total, status || 'pending']
    );
    return result.lastID;
  }

  /**
   * Update order status
   */
  async updateStatus(id, status) {
    await database.runAsync(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  /**
   * Delete order
   */
  async delete(id) {
    await database.runAsync('DELETE FROM orders WHERE id = ?', [id]);
  }

  /**
   * Count orders by status
   */
  async countByStatus(status) {
    const result = await database.getAsync(
      'SELECT COUNT(*) as count FROM orders WHERE status = ?',
      [status]
    );
    return result.count;
  }

  /**
   * Count total orders
   */
  async count() {
    const result = await database.getAsync('SELECT COUNT(*) as count FROM orders');
    return result.count;
  }

  /**
   * Get total revenue
   */
  async getTotalRevenue() {
    const result = await database.getAsync(
      `SELECT SUM(total) as revenue FROM orders 
       WHERE status IN ('confirmed', 'shipped', 'completed')`
    );
    return result.revenue || 0;
  }

  /**
   * Find orders by status
   */
  async findByStatus(status) {
    return await database.allAsync(
      'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
  }
}

module.exports = new OrderRepository();
