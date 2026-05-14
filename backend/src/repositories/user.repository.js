/**
 * User Repository
 * Data access layer for users table
 */

const database = require('../config/database');

class UserRepository {
  /**
   * Find user by ID
   */
  async findById(id) {
    return await database.getAsync(
      'SELECT id, email, role FROM users WHERE id = ?',
      [id]
    );
  }

  /**
   * Find user by email (includes password for authentication)
   */
  async findByEmail(email) {
    return await database.getAsync(
      'SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))',
      [email]
    );
  }

  /**
   * Find user by email (without password)
   */
  async findByEmailSafe(email) {
    return await database.getAsync(
      'SELECT id, email, role FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))',
      [email]
    );
  }

  /**
   * Create new user
   */
  async create(email, hashedPassword, role = 'user') {
    const result = await database.runAsync(
      'INSERT INTO users(email, password, role) VALUES(?, ?, ?)',
      [email, hashedPassword, role]
    );
    return result.lastID;
  }

  /**
   * Update user role
   */
  async updateRole(id, role) {
    await database.runAsync(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
  }

  /**
   * Update user password
   */
  async updatePassword(id, hashedPassword) {
    await database.runAsync(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
  }

  /**
   * Get all users (without passwords)
   */
  async findAll() {
    return await database.allAsync(
      'SELECT id, email, role FROM users ORDER BY id DESC',
      []
    );
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email) {
    const user = await database.getAsync(
      'SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))',
      [email]
    );
    return !!user;
  }

  /**
   * Delete user
   */
  async delete(id) {
    await database.runAsync('DELETE FROM users WHERE id = ?', [id]);
  }

  /**
   * Count total users
   */
  async count() {
    const result = await database.getAsync('SELECT COUNT(*) as count FROM users');
    return result.count;
  }

  /**
   * Count users by role
   */
  async countByRole(role) {
    const result = await database.getAsync(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      [role]
    );
    return result.count;
  }
}

module.exports = new UserRepository();
