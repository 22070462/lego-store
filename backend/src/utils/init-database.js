/**
 * Database Initialization
 * Creates tables and seeds default data
 */

const database = require('../config/database');
const bcrypt = require('bcrypt');
const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, BCRYPT_ROUNDS } = require('../config/constants');

async function initializeDatabase() {
  console.log('Initializing database...');

  try {
    // Create tables
    await createTables();
    console.log('✓ Database tables created');

    // Seed default admin
    await seedDefaultAdmin();
    console.log('✓ Default admin account ensured');

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

async function createTables() {
  // Users table
  await database.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin'))
    )
  `);

  // Products table
  await database.runAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      image_url TEXT,
      age_min INTEGER CHECK(age_min >= 0),
      pieces INTEGER CHECK(pieces >= 0),
      theme TEXT DEFAULT 'Classic',
      stock INTEGER DEFAULT 0 CHECK(stock >= 0),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  await database.runAsync(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      subtotal REAL NOT NULL CHECK(subtotal >= 0),
      tax REAL NOT NULL CHECK(tax >= 0),
      shipping REAL NOT NULL CHECK(shipping >= 0),
      total REAL NOT NULL CHECK(total >= 0),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'confirmed', 'shipped', 'completed', 'cancelled')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order items table
  await database.runAsync(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      qty INTEGER NOT NULL CHECK(qty > 0),
      image_url TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);

  // Payment transactions table
  await database.runAsync(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      tx_ref TEXT UNIQUE NOT NULL,
      method TEXT DEFAULT 'qr',
      amount REAL NOT NULL CHECK(amount > 0),
      qr_payload TEXT,
      qr_text TEXT,
      qr_expires_at TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
      paid_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Create indexes
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_payment_tx_ref ON payment_transactions(tx_ref)');
  await database.runAsync('CREATE INDEX IF NOT EXISTS idx_payment_order ON payment_transactions(order_id)');
}

async function seedDefaultAdmin() {
  // Check if admin exists
  const existing = await database.getAsync(
    'SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))',
    [DEFAULT_ADMIN_EMAIL]
  );

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, BCRYPT_ROUNDS);

  if (existing) {
    // Update existing admin
    await database.runAsync(
      'UPDATE users SET password = ?, role = ? WHERE id = ?',
      [hashedPassword, 'admin', existing.id]
    );
  } else {
    // Create new admin
    await database.runAsync(
      'INSERT INTO users(email, password, role) VALUES(?, ?, ?)',
      [DEFAULT_ADMIN_EMAIL, hashedPassword, 'admin']
    );
  }
}

module.exports = initializeDatabase;
