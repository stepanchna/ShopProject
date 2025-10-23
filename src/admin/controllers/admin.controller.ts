import { Request, Response } from 'express';
import db from '../../database/db';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API = 'http://localhost:3000/api/products';

type Product = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
};

type CheckboxValue = string | string[] | undefined;
const norm = (v: CheckboxValue): string[] => (Array.isArray(v) ? v : v ? [v] : []);

export function getProducts(_req: Request, res: Response) {
  const products = db.prepare('SELECT * FROM products').all() as unknown as Product[];
  res.render('products', { products });
}

export function getNewProduct(_req: Request, res: Response) {
  res.render('new-product');
}

export async function postNewProduct(req: Request, res: Response) {
  try {
    const { title, description = '', price } = req.body as {
      title?: string; description?: string; price?: string | number;
    };
    if (!title || price === undefined) {
      return res.status(400).send('Title and price are required');
    }

    const id = uuidv4();
    const payload: Product = {
      id,
      title,
      description: description ?? '',
      price: Number(price),
    };

    const createdResp = await axios.post<Product>(API, payload);
    return res.redirect(`/admin/${createdResp.data.id}`);
  } catch (e: any) {
    console.error('Create product failed:', e?.response?.data || e);
    return res.status(400).send('Failed to create product');
  }
}

export async function getProductPage(req: Request, res: Response) {
  const id = req.params.id;

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as Product | undefined;
  if (!product) return res.status(404).send('Product not found');

  try {
    const relatedResp = await axios.get<Product[]>(`${API}/${id}/related`);
    const related = Array.isArray(relatedResp.data) ? relatedResp.data : [];

    const all = db.prepare('SELECT * FROM products').all() as unknown as Product[];
    const relatedIds = new Set<string>(related.map((p) => p.id));
    const other = all.filter((p) => p.id !== id && !relatedIds.has(p.id));

    return res.render('product', { product, related, other });
  } catch (e: any) {
    console.error('Load related failed:', e?.response?.data || e);
    const all = db.prepare('SELECT * FROM products').all() as unknown as Product[];
    const other = all.filter((p) => p.id !== id);
    return res.render('product', { product, related: [] as Product[], other });
  }
}

export async function postProductChanges(req: Request, res: Response) {
  const { id } = req.params;

  const body = req.body as Record<string, CheckboxValue>;
  const toRemove = norm(body.removeRelated);
  const toAdd = norm(body.addRelated);

  try {
    if (toAdd.length) {
      const pairs = toAdd.map((relatedId) => ({ productId: id, relatedId }));
      await axios.post(`${API}/related`, pairs);
    }
    if (toRemove.length) {
      const del = db.prepare('DELETE FROM related_products WHERE product_id = ? AND related_id = ?');
      for (const rid of toRemove) del.run(id, rid);
    }

    return res.redirect(`/admin/${id}`);
  } catch (e: any) {
    console.error('Save changes failed:', e?.response?.data || e);
    return res.status(400).send('Failed to save changes');
  }
}
