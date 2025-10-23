import sqlite3 from 'better-sqlite3'; 

const db = new sqlite3('./shop.db');  

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS related_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT NOT NULL,
    related_id TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (related_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

console.log('✅ Tables initialized');
export default db;
