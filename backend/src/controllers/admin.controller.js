/**
 * Admin Controller
 * Handles admin-related HTTP requests
 */

const userRepository = require('../repositories/user.repository');
const orderRepository = require('../repositories/order.repository');
const ResponseHelper = require('../utils/response.helper');

class AdminController {
  /**
   * Get all users
   * GET /admin/users
   */
  async getUsers(req, res) {
    try {
      const users = await userRepository.findAll();
      return ResponseHelper.success(res, 'Users retrieved', users);
    } catch (error) {
      console.error('Get users error:', error);
      return ResponseHelper.error(res, 'Failed to get users');
    }
  }

  /**
   * Update user role
   * PATCH /admin/users/:id/role
   */
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'admin'].includes(role)) {
        return ResponseHelper.error(res, 'Invalid role', 400);
      }

      const user = await userRepository.findById(id);
      if (!user) {
        return ResponseHelper.notFound(res, 'User');
      }

      await userRepository.updateRole(id, role);

      return ResponseHelper.success(res, 'User role updated');
    } catch (error) {
      console.error('Update user role error:', error);
      return ResponseHelper.error(res, 'Failed to update user role');
    }
  }

  /**
   * Get all orders (admin)
   * GET /admin/orders
   */
  async getAllOrders(req, res) {
    try {
      const orders = await orderRepository.findAll();
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
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return ResponseHelper.error(res, 'Invalid status', 400);
      }

      await orderRepository.updateStatus(id, status);

      return ResponseHelper.success(res, 'Order status updated');
    } catch (error) {
      console.error('Update order status error:', error);
      return ResponseHelper.error(res, error.message || 'Failed to update order status', 400);
    }
  }
}

module.exports = new AdminController();
