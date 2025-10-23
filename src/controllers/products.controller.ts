import { Request, Response } from 'express';
import db from '../database/db'; 
import { v4 as uuidv4 } from 'uuid'; 
import * as axios from 'axios'; 
const API = 'http://localhost:3000/api/products'; 

export function getAllProducts(req: Request, res: Response) {
  try {
   
    const products = db.prepare('SELECT * FROM products').all();

    if (!Array.isArray(products)) {
      console.error('Expected products to be an array, but received:', products);
      return res.status(500).send('Failed to fetch products');
    }

    res.json(products); 
  } catch (e) {
    console.error('Error getting all products:', e);
    res.status(500).send('Failed to fetch products');
  }
}

export function getProductById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).send('Product not found');
    res.json(product); 
  } catch (e) {
    console.error('Error getting product by id:', e);
    res.status(500).send('Failed to fetch product');
  }
}


export function getRelated(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const stmt = db.prepare(`
      SELECT p.* FROM related_products r
      JOIN products p ON p.id = r.related_id
      WHERE r.product_id = ?
    `); 
    const related = stmt.all(id); 
    res.json(related); 
  } catch (e) {
    console.error('Error getting related products:', e);
    res.status(500).send('Failed to fetch related products');
  }
}

export async function addRelated(req: Request, res: Response) {
  const pairs = req.body;
  try {
    if (!Array.isArray(pairs)) return res.status(400).json({ error: 'Expected array' });

    const stmt = db.prepare(`
      INSERT INTO related_products (product_id, related_id) VALUES (?, ?)
    `);

    const insert = db.transaction((pairs: { productId: string; relatedId: string }[]) => {
      for (const pair of pairs) {
        stmt.run(pair.productId, pair.relatedId);
      }
    });

    insert(pairs); 
    res.json({ success: true });
  } catch (e) {
    console.error('Error adding related products:', e);
    res.status(500).send('Failed to add related products');
  }
}


export async function createProduct(req: Request, res: Response) {
  const { title, description, price } = req.body;
  try {
    if (!title || !price) {
      return res.status(400).send('Title and price are required');
    }
    const id = uuidv4(); 

  
    db.prepare('INSERT INTO products (id, title, description, price) VALUES (?, ?, ?, ?)')
      .run(id, title, description || '', price);

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id); 
    res.status(201).json(newProduct); 
  } catch (e) {
    console.error('Error creating product:', e);
    res.status(500).send('Failed to create product');
  }
}

export async function deleteRelated(req: Request, res: Response) {
  const ids = req.body;
  try {
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'Expected array of ids' });

    const stmt = db.prepare('DELETE FROM related_products WHERE product_id = ?');
    const del = db.transaction((ids: string[]) => {
      for (const id of ids) stmt.run(id);
    });

    del(ids); 
    res.json({ success: true });
  } catch (e) {
    console.error('Error deleting related products:', e);
    res.status(500).send('Failed to delete related products');
  }
}
