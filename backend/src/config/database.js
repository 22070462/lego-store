/**
 * Database Configuration and Connection
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_PATH } = require('./constants');

class Database {
  constructor() {
    this.db = null;
  }

  connect() {
    const dbPath = path.resolve(DB_PATH);
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
      }
      console.log('✓ Connected to SQLite database:', dbPath);
    });

    // Enable foreign keys
    this.db.run('PRAGMA foreign_keys = ON');
    
    return this.db;
  }

  getConnection() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }

  // Promisified database methods
  runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  getAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  allAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      if (!this.db) return resolve();
      this.db.close((err) => {
        if (err) return reject(err);
        console.log('✓ Database connection closed');
        resolve();
      });
    });
  }
}

module.exports = new Database();
