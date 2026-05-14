/**
 * Product Service
 * Business logic for product management
 */

const productRepository = require('../repositories/product.repository');

class ProductService {
  /**
   * Get all products
   */
  async getAllProducts() {
    return await productRepository.findAll();
  }

  /**
   * Get product by ID
   */
  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  /**
   * Create new product
   */
  async createProduct(productData) {
    const { name, price } = productData;

    if (!name || price == null) {
      throw new Error('Name and price are required');
    }

    if (price < 0) {
      throw new Error('Price must be positive');
    }

    const productId = await productRepository.create(productData);
    return productId;
  }

  /**
   * Update product
   */
  async updateProduct(id, productData) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const { name, price } = productData;

    if (!name || price == null) {
      throw new Error('Name and price are required');
    }

    if (price < 0) {
      throw new Error('Price must be positive');
    }

    // Preserve existing image if no new image provided
    if (!productData.image_url) {
      productData.image_url = existing.image_url;
    }

    await productRepository.update(id, productData);
  }

  /**
   * Delete product
   */
  async deleteProduct(id) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    await productRepository.delete(id);
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(threshold = 10) {
    return await productRepository.findLowStock(threshold);
  }

  /**
   * Search products
   */
  async searchProducts(query) {
    return await productRepository.search(query);
  }

  /**
   * Get products by theme
   */
  async getProductsByTheme(theme) {
    return await productRepository.findByTheme(theme);
  }

  /**
   * Get all themes
   */
  async getThemes() {
    return await productRepository.getThemes();
  }
}

module.exports = new ProductService();
