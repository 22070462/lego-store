/**
 * Product Repository
 * Data access layer for products table
 */

const database = require('../config/database');

class ProductRepository {
  /**
   * Find product by ID
   */
  async findById(id) {
    return await database.getAsync(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
  }

  /**
   * Find all products
   */
  async findAll() {
    return await database.allAsync(
      'SELECT * FROM products ORDER BY datetime(created_at) DESC, id DESC',
      []
    );
  }

  /**
   * Find products by IDs
   */
  async findByIds(ids) {
    if (!ids || !ids.length) return [];
    const placeholders = ids.map(() => '?').join(',');
    return await database.allAsync(
      `SELECT * FROM products WHERE id IN (${placeholders})`,
      ids
    );
  }

  /**
   * Create new product
   */
  async create(productData) {
    const { name, price, image_url, age_min, pieces, theme, stock } = productData;
    const result = await database.runAsync(
      `INSERT INTO products(name, price, image_url, age_min, pieces, theme, stock, created_at) 
       VALUES(?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, price, image_url || '', age_min || null, pieces || null, theme || 'Classic', stock || 0]
    );
    return result.lastID;
  }

  /**
   * Update product
   */
  async update(id, productData) {
    const { name, price, image_url, age_min, pieces, theme, stock } = productData;
    await database.runAsync(
      `UPDATE products 
       SET name = ?, price = ?, image_url = ?, age_min = ?, pieces = ?, theme = ?, stock = ?
       WHERE id = ?`,
      [name, price, image_url, age_min || null, pieces || null, theme || 'Classic', stock || 0, id]
    );
  }

  /**
   * Delete product
   */
  async delete(id) {
    await database.runAsync('DELETE FROM products WHERE id = ?', [id]);
  }

  /**
   * Decrement stock
   */
  async decrementStock(id, quantity) {
    await database.runAsync(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, id]
    );
  }

  /**
   * Increment stock
   */
  async incrementStock(id, quantity) {
    await database.runAsync(
      'UPDATE products SET stock = stock + ? WHERE id = ?',
      [quantity, id]
    );
  }

  /**
   * Find low stock products
   */
  async findLowStock(threshold = 10) {
    return await database.allAsync(
      'SELECT * FROM products WHERE stock <= ? ORDER BY stock ASC',
      [threshold]
    );
  }

  /**
   * Find products by theme
   */
  async findByTheme(theme) {
    return await database.allAsync(
      'SELECT * FROM products WHERE theme = ? ORDER BY created_at DESC',
      [theme]
    );
  }

  /**
   * Search products by name
   */
  async search(query) {
    return await database.allAsync(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY created_at DESC',
      [`%${query}%`]
    );
  }

  /**
   * Count total products
   */
  async count() {
    const result = await database.getAsync('SELECT COUNT(*) as count FROM products');
    return result.count;
  }

  /**
   * Get all unique themes
   */
  async getThemes() {
    const results = await database.allAsync(
      'SELECT DISTINCT theme FROM products WHERE theme IS NOT NULL ORDER BY theme'
    );
    return results.map(r => r.theme);
  }
}

module.exports = new ProductRepository();
