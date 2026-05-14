/**
 * Order Item Repository
 * Data access layer for order_items table
 */

const database = require('../config/database');

class OrderItemRepository {
  /**
   * Find order items by order ID
   */
  async findByOrderId(orderId) {
    return await database.allAsync(
      `SELECT id, order_id, product_id, name, price, qty, image_url 
       FROM order_items 
       WHERE order_id = ? 
       ORDER BY id ASC`,
      [orderId]
    );
  }

  /**
   * Create order item
   */
  async create(itemData) {
    const { order_id, product_id, name, price, qty, image_url } = itemData;
    const result = await database.runAsync(
      `INSERT INTO order_items(order_id, product_id, name, price, qty, image_url) 
       VALUES(?, ?, ?, ?, ?, ?)`,
      [order_id, product_id, name, price, qty, image_url || '']
    );
    return result.lastID;
  }

  /**
   * Bulk create order items
   */
  async bulkCreate(items) {
    const results = [];
    for (const item of items) {
      const id = await this.create(item);
      results.push(id);
    }
    return results;
  }

  /**
   * Delete order items by order ID
   */
  async deleteByOrderId(orderId) {
    await database.runAsync(
      'DELETE FROM order_items WHERE order_id = ?',
      [orderId]
    );
  }

  /**
   * Get order items with product details
   */
  async findByOrderIdWithProducts(orderId) {
    return await database.allAsync(
      `SELECT oi.*, p.stock, p.theme
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.id ASC`,
      [orderId]
    );
  }

  /**
   * Count items in order
   */
  async countByOrderId(orderId) {
    const result = await database.getAsync(
      'SELECT COUNT(*) as count FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return result.count;
  }
}

module.exports = new OrderItemRepository();
