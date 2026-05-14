/**
 * Create Test User
 * Creates a test user account for testing purposes
 */

const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('./users.db');
const db = new sqlite3.Database(dbPath);

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'password123';
  const role = 'user';

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.log('✓ Test user already exists:', email);
      db.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    console.log('✓ Test user created successfully!');
    console.log('  Email:', email);
    console.log('  Password:', password);
    console.log('  Role:', role);

  } catch (error) {
    console.error('✗ Error creating test user:', error.message);
  } finally {
    db.close();
  }
}

createTestUser();
