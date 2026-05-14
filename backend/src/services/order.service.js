/**
 * Order Service
 * Business logic for order management
 */

const orderRepository = require('../repositories/order.repository');
const orderItemRepository = require('../repositories/order-item.repository');
const productRepository = require('../repositories/product.repository');
const paymentService = require('./payment.service');
const paymentRepository = require('../repositories/payment.repository');
const database = require('../config/database');

class OrderService {
  /**
   * Create new order
   */
  async createOrder(userId, items) {
    // Normalize items
    const normalized = paymentService.normalizeItems(items);
    if (!normalized.length) {
      throw new Error('Order items are required');
    }

    // Get product IDs
    const productIds = normalized.map((it) => Number(it.productId)).filter((n) => Number.isFinite(n));
    if (!productIds.length) {
      throw new Error('Invalid product IDs');
    }

    // Fetch products
    const products = await productRepository.findByIds(productIds);
    if (products.length !== productIds.length) {
      throw new Error('Some products were not found');
    }

    // Build order items with stock validation
    const byId = new Map(products.map((p) => [String(p.id), p]));
    const orderItems = [];

    for (const item of normalized) {
      const product = byId.get(String(item.productId));
      if (!product) {
        throw new Error('Invalid item in order');
      }

      if (Number(product.stock || 0) < item.qty) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      orderItems.push({
        product_id: String(product.id),
        name: product.name,
        price: Number(product.price),
        qty: Number(item.qty),
        image_url: product.image_url || '',
      });
    }

    // Calculate totals
    const totals = paymentService.calcTotals(orderItems);

    // Begin transaction
    await database.runAsync('BEGIN TRANSACTION');

    try {
      // Create order
      const orderId = await orderRepository.create({
        user_id: userId,
        subtotal: totals.subtotal,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
        status: 'pending',
      });

      // Create order items
      for (const item of orderItems) {
        await orderItemRepository.create({
          order_id: orderId,
          ...item,
        });
      }

      // Generate payment data
      const qrData = paymentService.generateQrData(orderId, totals.total);

      // Create payment transaction
      const paymentId = await paymentRepository.create({
        order_id: orderId,
        tx_ref: qrData.txRef,
        method: 'qr',
        amount: totals.total,
        qr_payload: qrData.qrPayload,
        qr_text: qrData.qrText,
        qr_expires_at: qrData.expiresAt,
        status: 'pending',
      });

      await database.runAsync('COMMIT');

      return {
        order: {
          id: orderId,
          ...totals,
          status: 'pending',
        },
        payment: {
          id: paymentId,
          tx_ref: qrData.txRef,
          method: 'qr',
          amount: totals.total,
          status: 'pending',
          qr_payload: qrData.qrPayload,
          qr_text: qrData.qrText,
          qr_expires_at: qrData.expiresAt,
        },
      };
    } catch (error) {
      await database.runAsync('ROLLBACK');
      throw error;
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId) {
    return await orderRepository.findByUserId(userId);
  }

  /**
   * Get order details
   */
  async getOrderDetail(orderId, userId, isAdmin = false) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Check authorization
    if (!isAdmin && Number(order.user_id) !== Number(userId)) {
      throw new Error('Forbidden');
    }

    // Get order items
    const items = await orderItemRepository.findByOrderId(orderId);

    // Get payment info
    const payment = await paymentRepository.findByOrderId(orderId);

    const result = {
      order,
      items,
      payment,
    };

    // Include user email for admin
    if (isAdmin) {
      const userRepository = require('../repositories/user.repository');
      const user = await userRepository.findById(order.user_id);
      result.userEmail = user ? user.email : null;
    }

    return result;
  }

  /**
   * Get all orders (admin)
   */
  async getAllOrders() {
    return await orderRepository.findAll();
  }

  /**
   * Update order status (admin)
   */
  async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    await orderRepository.updateStatus(orderId, status);
  }
}

module.exports = new OrderService();
