/**
 * Order Controller
 * Handles order-related HTTP requests
 */

const orderService = require('../services/order.service');
const ResponseHelper = require('../utils/response.helper');

class OrderController {
  /**
   * Create order
   * POST /orders
   */
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { items } = req.body;

      const result = await orderService.createOrder(userId, items);

      return ResponseHelper.success(
        res,
        'Order created. Awaiting payment.',
        result,
        201
      );
    } catch (error) {
      console.error('Create order error:', error);
      return ResponseHelper.error(res, error.message || 'Failed to create order', 400);
    }
  }

  /**
   * Get user orders
   * GET /orders
   */
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await orderService.getUserOrders(userId);

      return ResponseHelper.success(res, 'Orders retrieved', orders);
    } catch (error) {
      console.error('Get orders error:', error);
      return ResponseHelper.error(res, 'Failed to get orders');
    }
  }

  /**
   * Get order detail
   * GET /orders/:id
   */
  async getDetail(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check if user is admin
      const userRepository = require('../repositories/user.repository');
      const user = await userRepository.findById(userId);
      const isAdmin = user && user.role === 'admin';

      const orderDetail = await orderService.getOrderDetail(id, userId, isAdmin);

      return ResponseHelper.success(res, 'Order detail retrieved', orderDetail);
    } catch (error) {
      if (error.message === 'Order not found') {
        return ResponseHelper.notFound(res, 'Order');
      }
      if (error.message === 'Forbidden') {
        return ResponseHelper.forbidden(res);
      }
      console.error('Get order detail error:', error);
      return ResponseHelper.error(res, 'Failed to get order detail');
    }
  }

  /**
   * Get all orders (admin)
   * GET /admin/orders
   */
  async getAll(req, res) {
    try {
      const orders = await orderService.getAllOrders();
      return ResponseHelper.success(res, 'Orders retrieved', orders);
    } catch (error) {
      console.error('Get all orders error:', error);
      return ResponseHelper.error(res, 'Failed to get orders');
    }
  }

  /**
   * Update order status (admin)
   * PATCH /admin/orders/:id/status
   */
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await orderService.updateOrderStatus(id, status);

      return ResponseHelper.success(res, 'Order status updated');
    } catch (error) {
      console.error('Update order status error:', error);
      return ResponseHelper.error(res, error.message || 'Failed to update order status', 400);
    }
  }
}

module.exports = new OrderController();
