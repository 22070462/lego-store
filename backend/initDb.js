/**
 * Tạo users.db + schema (giống server.js). Chạy: node initDb.js
 */
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "users.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE,
password TEXT,
role TEXT DEFAULT "user"
)
`);
  db.run(`
CREATE TABLE IF NOT EXISTS products(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price REAL NOT NULL,
image_url TEXT,
age_min INTEGER,
pieces INTEGER,
theme TEXT
)
`);
});

db.close((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Đã tạo:", dbPath);
});
