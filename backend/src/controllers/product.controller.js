/**
 * Product Controller
 * Handles product-related HTTP requests
 */

const productService = require('../services/product.service');
const ResponseHelper = require('../utils/response.helper');

class ProductController {
  /**
   * Get all products
   * GET /products
   */
  async getAll(req, res) {
    try {
      const products = await productService.getAllProducts();
      return ResponseHelper.success(res, 'Products retrieved', products);
    } catch (error) {
      console.error('Get products error:', error);
      return ResponseHelper.error(res, 'Failed to get products');
    }
  }

  /**
   * Get product by ID
   * GET /products/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      return ResponseHelper.success(res, 'Product retrieved', product);
    } catch (error) {
      if (error.message === 'Product not found') {
        return ResponseHelper.notFound(res, 'Product');
      }
      console.error('Get product error:', error);
      return ResponseHelper.error(res, 'Failed to get product');
    }
  }

  /**
   * Create product (admin)
   * POST /admin/products
   */
  async create(req, res) {
    try {
      const { name, price, age_min, pieces, theme, stock } = req.body;
      const image_url = req.file ? `/uploads/${req.file.filename}` : '';

      const productId = await productService.createProduct({
        name,
        price: Number(price),
        image_url,
        age_min: age_min ? Number(age_min) : null,
        pieces: pieces ? Number(pieces) : null,
        theme: theme || 'Classic',
        stock: stock ? Number(stock) : 0,
      });

      return ResponseHelper.success(res, 'Product created', { id: productId }, 201);
    } catch (error) {
      console.error('Create product error:', error);
      return ResponseHelper.error(res, error.message || 'Failed to create product', 400);
    }
  }

  /**
   * Update product (admin)
   * PUT /admin/products/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, age_min, pieces, theme, stock } = req.body;
      const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

      const productData = {
        name,
        price: Number(price),
        age_min: age_min ? Number(age_min) : null,
        pieces: pieces ? Number(pieces) : null,
        theme: theme || 'Classic',
        stock: stock ? Number(stock) : 0,
      };

      if (image_url) {
        productData.image_url = image_url;
      }

      await productService.updateProduct(id, productData);

      return ResponseHelper.success(res, 'Product updated');
    } catch (error) {
      if (error.message === 'Product not found') {
        return ResponseHelper.notFound(res, 'Product');
      }
      console.error('Update product error:', error);
      return ResponseHelper.error(res, error.message || 'Failed to update product', 400);
    }
  }

  /**
   * Delete product (admin)
   * DELETE /admin/products/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(id);
      return ResponseHelper.success(res, 'Product deleted');
    } catch (error) {
      if (error.message === 'Product not found') {
        return ResponseHelper.notFound(res, 'Product');
      }
      console.error('Delete product error:', error);
      return ResponseHelper.error(res, 'Failed to delete product');
    }
  }

  /**
   * Get low stock products (admin)
   * GET /admin/products/low-stock
   */
  async getLowStock(req, res) {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 10;
      const products = await productService.getLowStockProducts(threshold);
      return ResponseHelper.success(res, 'Low stock products retrieved', products);
    } catch (error) {
      console.error('Get low stock error:', error);
      return ResponseHelper.error(res, 'Failed to get low stock products');
    }
  }
}

module.exports = new ProductController();
