import db from '../database/db';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export function getAllProducts(): Product[] {
  const stmt = db.prepare('SELECT * FROM products');
  return stmt.all() as Product[];
}

export function getProductById(id: string): Product | undefined {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  return stmt.get(id) as Product | undefined;
}
