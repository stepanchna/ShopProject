import db from './db';

db.exec(`PRAGMA foreign_keys = ON;`);

db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL
);

-- таблица связей: составной PK предотвращает дубли пар
CREATE TABLE IF NOT EXISTS related_products (
  product_id TEXT NOT NULL,
  related_id TEXT NOT NULL,
  PRIMARY KEY (product_id, related_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (related_id) REFERENCES products(id) ON DELETE CASCADE
);

-- индексы для ускорения запросов в обе стороны связи
CREATE INDEX IF NOT EXISTS idx_related_product ON related_products(product_id);
CREATE INDEX IF NOT EXISTS idx_related_related ON related_products(related_id);
`);

console.log('✅ Tables initialized');
