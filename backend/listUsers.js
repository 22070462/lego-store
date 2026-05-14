const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./users.db');

db.all('SELECT id, email, role FROM users ORDER BY id', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('\n📋 Available Users:\n');
    rows.forEach(u => {
      console.log(`  ${u.id}. ${u.email.padEnd(30)} [${u.role}]`);
    });
    console.log('');
  }
  db.close();
});
